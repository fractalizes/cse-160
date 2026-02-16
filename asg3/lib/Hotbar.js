class Hotbar {
  constructor() {
    this.num = 1;
    this.indicator = document.getElementById("hotbar");
    const hotbar = new Image();
    if (hotbar) {
        hotbar.src = hotbarPath + `hotbar.webp`;
        this.indicator.appendChild(hotbar);
    }

    this.selector = document.getElementById("hotbar-selector");
    this.selector.style.left = "0px";
    const selector = new Image();
    if (selector) {
        selector.src = hotbarPath + `hotbar_selector.png`;
        this.selector.appendChild(selector);
    }

    this.items = document.getElementById("hotbar-items");
    const grassImage = new Image;
    if (grassImage) {
      grassImage.src = hotbarPath + `grass_block.webp`;
      this.items.append(grassImage);
    }

    const leavesImage = new Image;
    if (leavesImage) {
      leavesImage.src = hotbarPath + `leaves_block.png`;
      this.items.append(leavesImage);
    }

    const dirtImage = new Image;
    if (dirtImage) {
      dirtImage.src = hotbarPath + `dirt_block.webp`;
      this.items.append(dirtImage);
    }

    const stoneImage = new Image;
    if (stoneImage) {
      stoneImage.src = hotbarPath + `stone_block.webp`;
      this.items.append(stoneImage);
    }

    const glassImage = new Image;
    if (glassImage) {
      glassImage.src = hotbarPath + `glass_block.webp`;
      this.items.append(glassImage);
    }

    const luckyImage = new Image;
    if (luckyImage) {
      luckyImage.src = hotbarPath + `lucky_block.webp`;
      this.items.append(luckyImage);
    }

    const unknownImage = new Image;
    if (unknownImage) {
      unknownImage.src = hotbarPath + `unknown_block.webp`;
      this.items.append(unknownImage);
    }

    const pinkImage = new Image;
    if (pinkImage) {
      pinkImage.src = hotbarPath + `pink_block.png`;
      this.items.append(pinkImage);
    }

    const redImage = new Image;
    if (redImage) {
      redImage.src = hotbarPath + `maroon_block.png`;
      this.items.append(redImage);
    }
  }

  setBlock(num) {
    this.num = num;
    this.selector.style.left = 60 * (num - 1) + "px";
  }
}