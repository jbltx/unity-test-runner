const core = require('@actions/core');

class Output {
  static async setArtifactsPath(artifactsPath) {
    await core.setOutput('artifactsPath', artifactsPath);
  }

  static async setCoverageResultsPath(coverageResultsPath) {
    await core.setOutput('coverageResultsPath', coverageResultsPath);
  }
}

export default Output;
