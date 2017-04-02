#!/bin/bash

$(git push heroku `git subtree split --prefix server master`:master --force)