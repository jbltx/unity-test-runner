import { exec } from '@actions/exec';
import ImageTag from './image-tag';

class Docker {
  static async build(buildParameters, silent = false) {
    const { path, dockerfile, baseImage } = buildParameters;
    const { version } = baseImage;

    const tag = ImageTag.createForAction(version);
    const command = `docker build ${path} \
      --file ${dockerfile} \
      --build-arg IMAGE=${baseImage} \
      --tag ${tag}`;

    await exec(command, undefined, { silent });

    return tag;
  }

  static async run(image, parameters, silent = false) {
    const {
      unityVersion,
      workspace,
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
    } = parameters;

    const command = `docker run \
        --workdir /github/workspace \
        --rm \
        --env UNITY_LICENSE \
        --env UNITY_LICENSE_FILE \
        --env UNITY_EMAIL \
        --env UNITY_PASSWORD \
        --env UNITY_SERIAL \
        --env UNITY_VERSION="${unityVersion}" \
        --env PROJECT_PATH="${projectPath}" \
        --env TEST_MODE="${testMode}" \
        --env ARTIFACTS_PATH="${artifactsPath}" \
        --env CUSTOM_PARAMETERS="${customParameters}" \
        ${enableCodeCoverage ? 
          `--env ENABLE_COVERAGE=1 \
           --env COVERAGE_OPTIONS=${coverageOptions} \
           --env COVERAGE_RESULTS_PATH=${coverageResultsPath} \
           ${coverageOnly ? '--env COVERAGE_ONLY=1' : ''}` 
          : ''} \
        --env DEBUG_CODE_OPTIMIZATION=${debugCodeOptimization} \
        --env HOME=/github/home \
        --env GITHUB_REF \
        --env GITHUB_SHA \
        --env GITHUB_REPOSITORY \
        --env GITHUB_ACTOR \
        --env GITHUB_WORKFLOW \
        --env GITHUB_HEAD_REF \
        --env GITHUB_BASE_REF \
        --env GITHUB_EVENT_NAME \
        --env GITHUB_WORKSPACE=/github/workspace \
        --env GITHUB_ACTION \
        --env GITHUB_EVENT_PATH \
        --env RUNNER_OS \
        --env RUNNER_TOOL_CACHE \
        --env RUNNER_TEMP \
        --env RUNNER_WORKSPACE \
        --volume "/var/run/docker.sock":"/var/run/docker.sock" \
        --volume "/home/runner/work/_temp/_github_home":"/github/home" \
        --volume "/home/runner/work/_temp/_github_workflow":"/github/workflow" \
        --volume "${workspace}":"/github/workspace" \
        ${useHostNetwork ? '--net=host' : ''} \
        ${image}`;

    await exec(command, undefined, { silent });
  }
}

export default Docker;
