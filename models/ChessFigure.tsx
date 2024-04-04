interface Figure {
  name: string;
  x: number;
  y: number;
  color: string;
  id: number;
}

export class Figures implements Figure {
  name: string;
  x: number;
  y: number;
  color: string;
  id: number;

  constructor(name: string, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = Math.random();
  }
}

export class Pawn extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-pawn', x, y, color);
  }

  checkRules(destX: number, destY: number, selectedDestination: any) {
    const deltaX = Math.abs(destX - this.x);

    if (this.color === 'white') {
      // can go forward one or two square when start
      if (
        this.x === destX &&
        this.y === 6 &&
        (this.y - destY === 1 || this.y - destY === 2)
      ) {
        return true;
      }
      // can go forward one
      else if (this.y - destY === 1 && this.x === destX) {
        return true;
      }
      // can remove figures
      else if (selectedDestination && deltaX === 1 && this.y - destY === 1) {
        return true;
      }
    } else if (this.color === 'black') {
      if (
        this.x === destX &&
        this.y === 1 &&
        (destY - this.y === 1 || destY - this.y === 2)
      ) {
        return true;
      } else if (destY - this.y === 1 && this.x === destX) {
        return true;
      } else if (selectedDestination && deltaX === 1 && destY - this.y === 1) {
        return true;
      }
    }
  }
}

export class Rook extends Figures {
  canRock: boolean;
  constructor(x: number, y: number, color: string) {
    super('chess-rook', x, y, color);
    this.canRock = true;
  }

  checkRules(destX: number, destY: number) {
    if (destX === this.x || destY === this.y) {
      this.canRock = false;
      return true;
    }
    return false;
  }
}

export class Knight extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-knight', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    // Check if the move follows the L-shaped pattern of a knight.
    const deltaX = Math.abs(destX - this.x);
    const deltaY = Math.abs(destY - this.y);

    return (deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1);
  }
}

export class Bishop extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-bishop', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    const checkX = Math.abs(destX - this.x);
    const checkY = Math.abs(destY - this.y);

    return checkX === checkY;
  }
}

export class Queen extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-queen', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    if (
      Bishop.prototype.checkRules.bind(this)(destX, destY) ||
      Rook.prototype.checkRules.bind(this)(destX, destY)
    ) {
      return true;
    }
    return false;
  }
}

export class King extends Figures {
  canRock = false;
  constructor(x: number, y: number, color: string) {
    super('chess-king', x, y, color);
    this.canRock = true;
  }

  checkRules(destX: number, destY: number) {
    const deltaX = Math.abs(destX - this.x);
    const deltaY = Math.abs(destY - this.y);

    if ((deltaX === 2 || deltaX === 3) && this.y === 7) {
      return true;
    }

    this.canRock = false;

    return (
      (deltaX === 1 && deltaY === 0) ||
      (deltaX === 0 && deltaY === 1) ||
      (deltaX === 1 && deltaY === 1)
    );
  }
}
