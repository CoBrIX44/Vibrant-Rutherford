import Phaser from 'phaser';
import { ERScene } from './scenes/ERScene';

export class EmergencyRoomGame {
  private game: Phaser.Game | null = null;
  private scene: ERScene | null = null;

  public init(containerId: string, isReducedMotion: boolean = false): void {
    if (this.game) return;

    this.scene = new ERScene();
    this.scene.setReducedMotion(isReducedMotion);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      width: 760,
      height: 480,
      transparent: false,
      backgroundColor: '#0F172A',
      scene: [this.scene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);
  }

  public setReducedMotion(reduced: boolean): void {
    if (this.scene) {
      this.scene.setReducedMotion(reduced);
    }
  }

  public destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.scene = null;
    }
  }
}
