<!doctype html>
<html ng-app="eygle">
<head>
    <base href="/">
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="author" content="Eygle">
    <title>Eygle downloads</title>

    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <!-- Place favicon.ico in the root directory -->

    <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:400,700'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(client) styles/vendor.css -->
    <!-- bower:css -->
    <!-- run `gulp inject` to automatically populate bower styles dependencies -->
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css(.tmp/client) styles/app.css -->
    <!-- inject:css -->
    <!-- css files will be automatically insert here -->
    <!-- endinject -->
    <!-- endbuild -->
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>

<!--[if lt IE 10]>
<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->

<body md-theme="default" ng-controller="AppController as vm"
      class="{{state.current.bodyClass || ''}}" ondrop="return false">

<div id="main" ng-class="'animate-slide-up'" ui-view="main" layout="column"></div>

<!-- build:js(client) scripts/vendor.js -->
<!-- bower:js -->
<!-- run `gulp inject` to automatically populate bower script dependencies -->
<!-- endbower -->
<!-- endbuild -->

<!-- build:js(.tmp/client) scripts/app.js -->
<!-- inject:js -->
<!-- js files will be automatically insert here -->
<!-- endinject -->

<!-- inject:partials -->
<!-- angular templates will be automatically converted in js and inserted here -->
<!-- endinject -->
<!-- endbuild -->
</body>
</html>