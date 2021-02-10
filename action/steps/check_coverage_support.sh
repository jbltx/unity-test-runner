#!/usr/bin/env bash

MANIFEST_PATH="$UNITY_PROJECT_PATH/Packages/manifest.json"

unity_ver=$UNITY_VERSION
semver=${unity_ver#[vV]}
UNITY_VERSION_MAJOR=${semver%%\.*}
UNITY_VERSION_MINOR=${semver#*.}
UNITY_VERSION_MINOR=${UNITY_VERSION_MINOR%.*}

CODE_COVERAGE_PACKAGE_NAME="com.unity.testtools.codecoverage"
CODE_COVERAGE_PACKAGE_VERSION="0.4.2-preview"

if [[ -z "$UNITY_VERSION_MAJOR" || -z "$UNITY_VERSION_MINOR" ]]; then 
    echo "Unable to parse the Unity version"
    COVERAGE_UNSUPPORTED=1
else
    if [[ $UNITY_VERSION_MAJOR -gt 2019 || ( $UNITY_VERSION_MAJOR -eq 2019 && $UNITY_VERSION_MINOR -gt 2 ) ]]; then
        echo "Checking manifest file for coverage package at \"$MANIFEST_PATH\"."
        cat "$MANIFEST_PATH" | grep -q "$CODE_COVERAGE_PACKAGE_NAME"
        coverage_package_present=$?
        if [[ $coverage_package_present -gt 0 ]]; then 
            echo "Adding Coverage package manually in the manifest."
            regex_pattern=$( printf '0,/,/s//,\\n    "%s":"%s",/' "$CODE_COVERAGE_PACKAGE_NAME" "$CODE_COVERAGE_PACKAGE_VERSION" )
            sed "$regex_pattern" "$MANIFEST_PATH" > "$MANIFEST_PATH"
            cat "$MANIFEST_PATH"
            coverage_package_present2=$( cat "$MANIFEST_PATH" | grep -q "$CODE_COVERAGE_PACKAGE_NAME" )
            if [[ $coverage_package_present2 -gt 0 ]]; then 
              echo "Unable to insert package into the Unity Project manifest file \"$MANIFEST_PATH\""
              COVERAGE_UNSUPPORTED=1
            fi
        fi
    else 
        echo "Unity version $UNITY_VERSION doesn't support the Coverage package. Coverage requires Unity 2019.3+"
        COVERAGE_UNSUPPORTED=1
    fi
fi

