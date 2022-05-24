const fs = require('fs');
const PNG = require('pngjs3/dist/pngjs3').default;
const { program } = require('commander');
const ProgressBar = require('progress');

const packageInfo = require('../package.json');
const { verifyInputFile, createOutputFileName, verifyOutputFile, brightnessToColorValue } = require('./utils');
const { transparentify } = require('./utils/color');

async function main(inputFile, outputFile, options) {
  try {
    verifyInputFile(inputFile)
    if(!outputFile) {
      outputFile = createOutputFileName(inputFile)
    }
    // await verifyOutputFile(outputFile)

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
          console.log(e);
          console.log(' ');
          program.error(`err: A problem occured while processing image. This seems an unexpected error. Please report this issue at ${packageInfo.author.email} to help us improve this tool.`, e);
        }
      })
  } catch (e) {
    console.log(e);
    console.log(' ');
    program.error('err: A generic error occured.');
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

  const pixelColor = {
    r: image.data[idx], 
    g: image.data[idx + 1], 
    b:  image.data[idx + 2],
    a: 1
  }

  const newColor = transparentify(pixelColor);

  image.data[idx] = newColor.r
  image.data[idx + 1] = newColor.g
  image.data[idx + 2] = newColor.b
  image.data[idx + 3] = newColor.a * 255

}
