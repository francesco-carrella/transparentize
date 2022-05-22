const fs = require('fs');
const PNG = require('pngjs3/dist/pngjs3').default;
const { colord } = require('colord');
const { program } = require('commander');
var ProgressBar = require('progress');

const packageInfo = require('../package.json');
const { verifyInputFile, createOutputFileName, verifyOutputFile, brightnessToColorValue } = require('./utils');

async function main(inputFile, outputFile, options) {
  try {
    verifyInputFile(inputFile)
    if(!outputFile) {
      outputFile = createOutputFileName(inputFile)
    }
    await verifyOutputFile(outputFile)

    fs.createReadStream(inputFile)
      .pipe(
        new PNG({
          filterType: 4,
          inputColorType: 6,
          colorType: 6,
        }),
      )
      .on('error', function () {
        program.error(`err: Impossible to read the input file '${inputFile}'. Please check the <input_file> argument and retry.`);
      })
      .on('parsed', function () {
        try {
          processImage(this, options);
          this.pack().pipe(fs.createWriteStream(outputFile));
          console.log(`Image processed successfully. The output file is '${outputFile}'.`);
        } catch (e) {
          program.error(`err: A problem occured while processing image. This seems an unexpected error. Please report this issue at ${packageInfo.author.email} to help us improve this tool.`);
        }
      })
  } catch (e) {
    console.log('err: A generic error occured.');
  }
}

module.exports = main


function processImage(image, options) {
  var progressBar = new ProgressBar(':bar', { total: image.width * image.height });

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      processPixel(image, x, y, options);
      progressBar.tick();
    }
  }
}

function processPixel(image, x, y, options) {
  var idx = (image.width * y + x) * 4;
            
  const pixelColor = colord({
    r: image.data[idx], 
    g: image.data[idx + 1], 
    b: image.data[idx + 2],
    a: image.data[idx + 3]
  });

  const brightness = pixelColor.brightness();
  const transparentize = brightness <= options.maximumPixelBrightness / 100;

  image.data[idx] = transparentize ? 0 : brightnessToColorValue(brightness);
  image.data[idx + 1] = transparentize ? 0 : brightnessToColorValue(brightness);
  image.data[idx + 2] = transparentize ? 0 : brightnessToColorValue(brightness);
  image.data[idx + 3] = transparentize ? brightnessToColorValue(brightness, true) : 255;
}
