import { app } from 'electron';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Gets the absolute path to a resource within the application bundle.
 * In development, it points to the `resources` folder in the project root.
 * In production, it points to the `resources` folder inside the packaged app.
 * @param subpath The relative path to the resource from the `resources` directory.
 */
export function getResourcePath(subpath: string): string {
  if (isDev) {
    // In development, resources are in the project root's 'resources' directory
    return path.join(app.getAppPath(), '../../resources', subpath);
  }
  // In production, resources are packed into the app.asar's parent directory
  return path.join(process.resourcesPath, subpath);
}
