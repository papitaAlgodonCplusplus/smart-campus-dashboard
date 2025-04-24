const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Determine if we're switching to dev or prod mode
const mode = process.argv[2]?.toLowerCase();
if (!mode || (mode !== 'dev' && mode !== 'prod')) {
  console.error('Please specify mode: node dev_prod.js dev|prod');
  process.exit(1);
}

// Define file configurations
const fileConfigs = [
  {
    path: 'api/src/server.js',
    sections: [
      { devStart: 1, devEnd: 3, prodStart: 4, prodEnd: 6 }
    ],
    specialCase: true
  },
  {
    path: 'api/src/controllers/reservationController.js',
    sections: [
      { devStart: 1, devEnd: 2, prodStart: 3, prodEnd: 4 }
    ],
    specialCase: true
  }
];

// Function to scan a directory and add files that match a pattern to the fileConfigs
async function addDirectoryFiles(dir, pattern, defaultConfig) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.match(pattern) && !fileConfigs.some(config => config.path === path.join(dir, file))) {
        // Don't add files that are already in the specialCase list
        if (file === 'reservationController.js' && dir.includes('controllers')) {
          continue;
        }
        
        fileConfigs.push({
          path: path.join(dir, file),
          sections: [
            { devStart: 1, devEnd: 1, prodStart: 2, prodEnd: 2 }
          ],
          specialCase: false
        });
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err);
  }
}

// Process a single file
async function processFile(config) {
  try {
    const filePath = config.path;
    console.log(`Processing ${filePath}...`);
    
    // Read file content
    const content = await readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Process each section in the file
    for (const section of config.sections) {
      // Determine which lines to comment/uncomment based on mode
      const linesToComment = mode === 'prod' ? 
        { start: section.prodStart - 1, end: section.prodEnd - 1 } : 
        { start: section.devStart - 1, end: section.devEnd - 1 };
      
      const linesToUncomment = mode === 'prod' ? 
        { start: section.devStart - 1, end: section.devEnd - 1 } : 
        { start: section.prodStart - 1, end: section.prodEnd - 1 };
      
      // Comment out lines
      for (let i = linesToComment.start; i <= linesToComment.end; i++) {
        if (i < lines.length && !lines[i].trimStart().startsWith('//')) {
          lines[i] = '// ' + lines[i];
        }
      }
      
      // Uncomment lines
      for (let i = linesToUncomment.start; i <= linesToUncomment.end; i++) {
        if (i < lines.length && lines[i].trimStart().startsWith('//')) {
          lines[i] = lines[i].replace(/^\s*\/\/\s?/, '');
        }
      }
    }
    
    // Write back modified content
    await writeFile(filePath, lines.join('\n'));
    console.log(`✓ ${filePath} updated successfully`);
  } catch (err) {
    console.error(`Error processing file ${config.path}:`, err);
  }
}

// Main function
async function main() {
  console.log(`Switching to ${mode.toUpperCase()} mode...`);
  
  // Scan directories for relevant files
  await addDirectoryFiles('api/src/controllers', /\.js$/, { devStart: 1, devEnd: 1, prodStart: 2, prodEnd: 2 });
  await addDirectoryFiles('api/src/routes', /\.js$/, { devStart: 1, devEnd: 1, prodStart: 2, prodEnd: 2 });
  
  // Process each file
  for (const config of fileConfigs) {
    await processFile(config);
  }
  
  console.log(`\nAll files processed. System is now in ${mode.toUpperCase()} mode.`);
}

// Run the script
main().catch(err => {
  console.error('Failed to execute script:', err);
  process.exit(1);
});