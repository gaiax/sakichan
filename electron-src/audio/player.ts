const audioPlayer = require("node-wav-player");
export const playWav = (filePath: string) => {
  audioPlayer.play({
    path: filePath,
  });
};
