import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path';

/**
 * Loads a JSON file, adds an entry to it, writes it back to the file,
 * and returns the new file path.
 *
 * @param filePath - Path to the JSON file.
 * @param newEntry - The new entry to add to the JSON object.
 * @returns - The new file path where the modified JSON is saved.
 */
export function addSidecar(filePath: string, newEntry: Record<string, unknown>): string {
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
  
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let jsonData: Record<string, unknown>;
    
    try {
      jsonData = JSON.parse(fileContent);
    } catch (err) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }

    // Add the sidecar to the container definitions
    if (!Array.isArray(jsonData['containerDefinitions'])) {
      throw new Error(`Invalid containerDefinitions in JSON file: ${filePath}`);
    }

    jsonData['containerDefinitions'].push(newEntry);
  
    // Write the modified JSON back to the file
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const newFilePath = path.join(dir, `${baseName}-${Math.random().toString(36).substring(2, 15)}${ext}`);
    fs.writeFileSync(newFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
  
    // Return the path of the modified file
    return newFilePath;
  }
