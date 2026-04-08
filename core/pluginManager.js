import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PluginManager {
  constructor(app) {
    this.app = app;
    this.plugins = new Map();
  }

  async loadPlugins(pluginsDir) {
    const fullPath = path.resolve(__dirname, '..', pluginsDir);
    
    try {
      const pluginDirs = await fs.readdir(fullPath, { withFileTypes: true });
      
      for (const dirent of pluginDirs) {
        if (dirent.isDirectory()) {
          const pluginPath = path.join(fullPath, dirent.name, 'index.js');
          
          try {
            const pluginModule = await import(`file://${pluginPath}`);
            const plugin = pluginModule.default || pluginModule;
            
            this.registerPlugin(plugin);
          } catch (error) {
            console.error(`Failed to load plugin from ${pluginPath}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading plugins directory: ${error.message}`);
    }
  }

  registerPlugin(plugin) {
    if (!plugin.name || typeof plugin.init !== 'function' || typeof plugin.execute !== 'function') {
      console.warn(`Plugin ${plugin.name || 'unknown'} does not follow the standard interface.`);
      return;
    }

    plugin.init(this.app);
    this.plugins.set(plugin.name, plugin);
    console.log(`Plugin registered: ${plugin.name}`);
  }

  async runPlugins(input) {
    const results = {};
    for (const [name, plugin] of this.plugins) {
      console.log(`Executing plugin: ${name}`);
      results[name] = await plugin.execute(input);
    }
    return results;
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }
}
