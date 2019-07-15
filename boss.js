class BossShip {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.speed = 6;
        this.goingLeft = true;
        this.shield = 8;
        this.shieldRegenerateCD = 60 * 3.5;
        this.hp = 20;
        this.hit = false;
        this.fireEdge = false;
        this.prepareFire = false;
        this.particles = [];
        this.noShoot = false;
    }

    update() {
        // directional movement
        this.x = constrain(this.x, 50, width - 50);
        if (this.x <= 50 && this.goingLeft) {
            this.goingLeft = false;
        }
        else if (this.x == width - 50 && !this.goingLeft) {
            this.goingLeft = true;
        }
        if (this.goingLeft) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
        // update shield if been hit
        if (this.hit) {
            if (this.shield > 0) {
                this.shield--;
            } else {
                this.hp--;
            }
            this.hit = false;
        }
        // regenerate the shield after 25 frames
        if (this.shield == 0) {
            this.shieldRegenerateCD--;
            if (this.shieldRegenerateCD <= 0) {
                this.shield = 8;
                this.shieldRegenerateCD = 60 * 3.5;
            }
        }
        //shoot particles
        if (random(0, 100) < 20 && !this.noShoot) {
            this.particles.push({x : this.x, y : this.y, vec : createVector(random(-12, 12), 10)});
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].y += this.particles[i].vec.y;
            this.particles[i].x += this.particles[i].vec.x;
            // particles need to effect hp of player's ship
            if (dist(this.particles[i].x, this.particles[i].y, shipX, shipY) < 35) {
                shipHP--;
                this.particles.splice(i, 1);
            }
            // particles off screen get culled
            if (this.particles[i].y > height + 20) {
                this.particles.splice(i, 1);
            }
        }

        // cannon fire on the edges of the map
        if (this.x <= 120 || this.x >= width - 120) {
            this.prepareFire = true;
        } else {
            this.prepareFire = false;
        }
        if (this.x <= 75 || this.x >= width - 75) {
            this.fireEdge = true;
            // cannon beam fire should be a one shot kill
            if ((shipX <= 75 && this.x <= 75) || (this.x >= width - 75 && shipX >= width - 75)) {
                setTimeout(killPlayerShip, 300);
            }
        } else {
            this.fireEdge = false;
        }

    }

    attacked() {
        this.hit = true;
    }

    destroyed() {
        if (this.hp <= 0) {
            return true;
        }
    }

    pacify() {
        this.noShoot = true;
    }

    render() {
        // ship
        image(bossSprite, this.x, this.y, 100, 100);
        // shield
        if (this.shield > 0) {
            noFill();
            strokeWeight(3);
            stroke(255, 180, 180);
            ellipse(this.x, this.y, 120, 120);
        } else {
            fill(255, 255, 255);
            textAlign(CENTER);
            textSize(20);
            text("SHIELDS DOWN", this.x, this.y);
        }
        fill(0);
        stroke(0);
        strokeWeight(1);

        // bullets
        fill(100, 0, 0);
        for (let i = 0; i < this.particles.length; i++) {
            ellipse(this.particles[i].x, this.particles[i].y, 20, 20);
        }
        // beam attack
        noStroke();
        if (this.fireEdge) {
            rectMode(CORNER);
            fill(160, 160, 200);
            rect(this.x - 25, this.y + 45, 50, height);
            fill(255, 255, 255);
            rect(this.x -15, this.y + 45, 30, height);
            fill(random(200, 255), random(200, 255), random(200, 255));
            ellipse(this.x, this.y + 45, random(30, 35), random(30, 35));
        } else if (this.prepareFire) {
            fill(random(200, 255), random(200, 255), random(200, 255));
            ellipse(this.x, this.y + 45, random(30, 35), random(30, 35));
        }

        // hp bar
        stroke(0, 0, 0);
        rectMode(CENTER);
        fill(0,200, 0);
        rect(this.x, this.y - 60, this.hp * 5, 15);
    }
}

function killPlayerShip() {
    shipHP = 0;
}
