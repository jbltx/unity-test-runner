#!/usr/bin/env bash

MANIFEST_PATH="$UNITY_PROJECT_PATH/Packages/manifest.json"

unity_ver="$UNITY_VERSION"
semver=( ${unity_ver//./ } )
UNITY_VERSION_MAJOR=$( echo "${semver[0]}" | bc )
UNITY_VERSION_MINOR=$( echo "${semver[1]}" | bc )

if [[ -z "$UNITY_VERSION_MAJOR" || -z "$UNITY_VERSION_MINOR" ]]; then 
    echo "Unable to parse the Unity version"
    COVERAGE_UNSUPPORTED=1
else
    if [[ $UNITY_VERSION_MAJOR -gt 2019 || [$UNITY_VERSION_MAJOR -eq 2019 && $UNITY_VERSION_MINOR -gt 2] ]]; then
        echo "Checking manifest file for coverage package at \"$MANIFEST_PATH\"."
        cat "$MANIFEST_PATH" | grep -q "com.unity.testtools.codecoverage"
        coverage_package_present=$?
        if [[ $coverage_package_present -gt 0 ]]; then 
            echo "Adding Coverage package manually in the manifest."
            # todo
        fi
    else 
        echo "Unity version $UNITY_VERSION doesn't support the Coverage package. Coverage requires Unity 2019.3+"
        COVERAGE_UNSUPPORTED=1
    fi
fi

