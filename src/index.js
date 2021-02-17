import * as core from '@actions/core';
import { Action, Docker, Input, ImageTag, Output } from './model';

async function action() {
  Action.checkCompatibility();

  const { dockerfile, workspace, actionFolder } = Action;
  const {
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
  } = Input.getFromUser();
  const baseImage = ImageTag.createForBase({ version: unityVersion, customImage });

  try {
    // Build docker image
    const actionImage = await Docker.build({ path: actionFolder, dockerfile, baseImage });

    // Run docker image
    await Docker.run(actionImage, {
      workspace,
      unityVersion,
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
    });
  } finally {
    // Set output
    await Output.setArtifactsPath(artifactsPath);
    await Output.setCoverageResultsPath(coverageResultsPath);
  }
}

action().catch(error => {
  core.setFailed(error.message);
});
