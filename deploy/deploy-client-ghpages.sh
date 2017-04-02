#!/bin/bash

$(cp -R client/public/. client/dist)
$(cd client && yarn run build)

# TODO: Clear /dist before at the start of script, clone the gh-pages branch
# there with
# git clone git@github.com:JaakkoLipsanen/slacky.git --branch gh-pages
# and then build the build.js there and copy index.html.
# right now, this script fails if gh-pages isn't cloned into /dist
$(cd client/dist && git add . && git commit -m "New build" && git push origin gh-pages)