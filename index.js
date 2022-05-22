const fs = require('fs');
const PNG = require('pngjs3').default;
const { colord } = require('colord');

const luminosityTreshold = .2;

function quitWithError(message = "An error occurred") {
  console.error(message);
  process.exit(1);
}

function brightnessToColorValue(brightness, inverse = false) {
  const colorValue = Math.round(brightness * 255);
  return inverse ? 255 - colorValue : colorValue;
}

try {

  fs.createReadStream('./in.png')
    .pipe(
      new PNG({
        filterType: 4,
        inputColorType: 6,
        colorType: 6,
      }),
    )
    .on('error', function () {
      quitWithError("Error reading input file");
    })
    .on('parsed', function () {
      try {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) * 4;
            
            const currentColor = colord({
              r: this.data[idx], 
              g: this.data[idx + 1], 
              b: this.data[idx + 2],
              a: this.data[idx + 3]
            });

            const brightness = currentColor.brightness();
            const transparentize = brightness > luminosityTreshold;

            // this.data[idx] = transparentize ? 0 : this.data[idx];
            // this.data[idx + 1] = transparentize ? 0 : this.data[idx + 1];
            // this.data[idx + 2] = transparentize ? 0 : this.data[idx + 2];
            // this.data[idx + 3] = transparentize ? ((1 - currentColor.brightness()) * 255) : 255;

            this.data[idx] = transparentize ? 0 : brightnessToColorValue(brightness);
            this.data[idx + 1] = transparentize ? 0 : brightnessToColorValue(brightness);
            this.data[idx + 2] = transparentize ? 0 : brightnessToColorValue(brightness);
            this.data[idx + 3] = transparentize ? brightnessToColorValue(brightness, true) : 255;
            
            // this.data[idx] = 0
            // this.data[idx + 1] = 0
            // this.data[idx + 2] = 0
            // this.data[idx + 3] = brightnessToColorValue(brightness);
          }
        }

        this.pack().pipe(fs.createWriteStream('out.png'));
      } catch (e) {
        quitWithError("Error while processing image");
      }
    });
  
} catch (error) {
  quitWithError();
} 