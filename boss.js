class BossShip {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.speed = 6;
        this.goingLeft = true;
        this.shield = 8;
        this.sheildRegenerateCD = 60 * 10;
        this.hp = 20;
        this.hit = false;
        this.particles = [];
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
            this.sheild--;
            this.hit = false;
        }
        // regenerate the sheild after 25 frames
        if (this.sheild == 0) {
            this.shieldRegenerateCD--;
            if (this.sheildRegenerateCD == 0) {
                this.sheild = 8;
                this.sheildRegenerateCD = 60 * 10;
            }
        }
        //shoot particles
        if (random(0, 100) < 20) {
            this.particles.push({x : this.x, y : this.y, vec : createVector(random(-10, 10), 10)});
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

    }

    hit() {
        this.hit = true;
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
        }
        fill(0);
        stroke(0);
        strokeWeight(1);
        // bullets
        fill(100, 0, 0);
        for (let i = 0; i < this.particles.length; i++) {
            ellipse(this.particles[i].x, this.particles[i].y, 20, 20);
        }

        // hp bar
        rectMode(CENTER);
        fill(0,200, 0);
        rect(this.x, this.y - 60, this.hp * 5, 15);
    }
}
