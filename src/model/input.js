import { getInput } from '@actions/core';
import { includes } from 'lodash-es';
import UnityVersionParser from './unity-version-parser';

class Input {
  static get testModes() {
    return ['all', 'playmode', 'editmode'];
  }

  static isValidFolderName(folderName) {
    const validFolderName = new RegExp(/^(\.|\.\/)?(\.?\w+([_-]?\w+)*\/?)*$/);

    return validFolderName.test(folderName);
  }

  static getFromUser() {
    // Input variables specified in workflow using "with" prop.
    const rawUnityVersion = getInput('unityVersion') || 'auto';
    const customImage = getInput('customImage') || '';
    const testMode = getInput('testMode') || 'all';
    const rawProjectPath = getInput('projectPath') || '.';
    const rawArtifactsPath = getInput('artifactsPath') || 'artifacts';
    const rawUseHostNetwork = getInput('useHostNetwork') || 'false';
    const rawEnableCodeCoverage = getInput('enableCodeCoverage') || 'false';
    const rawCoverageOptions = getInput('coverageOptions') || '';
    const rawCoverageResultsPath = getInput('coverageResultsPath') || 'artifacts';
    const rawCoverageOnly = getInput('coverageOnly') || 'false';
    const rawDebugCodeOptimization = getInput('debugCodeOptimization') || 'false';
    const customParameters = getInput('customParameters') || '';

    // Validate input
    if (!includes(this.testModes, testMode)) {
      throw new Error(`Invalid testMode ${testMode}`);
    }

    if (!this.isValidFolderName(rawArtifactsPath)) {
      throw new Error(`Invalid artifactsPath "${rawArtifactsPath}"`);
    }

    if (!this.isValidFolderName(rawProjectPath)) {
      throw new Error(`Invalid projectPath "${rawProjectPath}"`);
    }

    if (rawUseHostNetwork !== 'true' && rawUseHostNetwork !== 'false') {
      throw new Error(`Invalid useHostNetwork "${rawUseHostNetwork}"`);
    }

    if (rawEnableCodeCoverage !== 'true' && rawEnableCodeCoverage !== 'false') {
      throw new Error(`Invalid enableCodeCoverage "${rawEnableCodeCoverage}"`);
    }

    if (!this.isValidFolderName(rawCoverageResultsPath)) {
      throw new Error(`Invalid coverageResultsPath "${rawCoverageResultsPath}"`);
    }

    if (rawCoverageOnly !== 'true' && rawCoverageOnly !== 'false') {
      throw new Error(`Invalid coverageOnly "${rawCoverageOnly}"`);
    }

    if (rawDebugCodeOptimization !== 'true' && rawDebugCodeOptimization !== 'false') {
      throw new Error(`Invalid debugCodeOptimization "${rawDebugCodeOptimization}"`);
    }

    // Sanitise input
    const projectPath = rawProjectPath.replace(/\/$/, '');
    const artifactsPath = rawArtifactsPath.replace(/\/$/, '');
    const useHostNetwork = rawUseHostNetwork === 'true';
    const unityVersion =
      rawUnityVersion === 'auto' ? UnityVersionParser.read(projectPath) : rawUnityVersion;
    const enableCodeCoverage = rawEnableCodeCoverage === 'true';
    const coverageOptions = rawCoverageOptions;
    const coverageResultsPath = rawCoverageResultsPath.replace(/\/$/, '');
    const coverageOnly = rawCoverageOnly === 'true';
    const debugCodeOptimization = rawDebugCodeOptimization === 'true';

    // Return sanitised input
    return {
      unityVersion,
      customImage,
      projectPath,
      testMode,
      artifactsPath,
      useHostNetwork,
      enableCodeCoverage,
      coverageOptions,
      coverageResultsPath,
      coverageOnly,
      debugCodeOptimization,
      customParameters,
    };
  }
}

export default Input;
