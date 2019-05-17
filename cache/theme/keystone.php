<?php return Vanilla\Addon::__set_state(array(
   'info' => 
  array (
    'key' => 'keystone',
    'name' => 'Keystone',
    'description' => 'A responsive Vanilla theme with customization options.',
    'version' => '1.0.0',
    'hidden' => false,
    'authors' => 
    array (
      0 => 
      array (
        'name' => 'Isis Graziatto',
        'email' => 'isis.g@vanillaforums.com',
        'homepage' => 'https://vanillaforums.com',
      ),
      1 => 
      array (
        'name' => 'Adam (charrondev) Charron',
        'email' => 'adam.c@vanillaforums.com',
        'homepage' => 'http://vanillaforums.com',
      ),
    ),
    'isResponsive' => true,
    'license' => 'GPL-2.0-only',
    'sites' => 
    array (
    ),
    'priority' => 1000,
    'type' => 'theme',
    'build' => 
    array (
      'process' => 'v1',
    ),
    'options' => 
    array (
      'Styles' => 
      array (
        'Default' => '%s_default',
        'Classic' => '%s_classic',
        'Dark' => '%s_dark',
        'Cerulean' => '%s_cerulean',
        'Coral' => '%s_coral',
        'Dusk' => '%s_dusk',
      ),
    ),
    'Issues' => 
    array (
    ),
  ),
   'classes' => 
  array (
    'keystonethemehooks' => 
    array (
      0 => 
      array (
        'namespace' => 'Vanilla\\Themes\\Keystone\\',
        'className' => 'KeystoneThemeHooks',
        'path' => '/KeystoneThemeHooks.php',
      ),
    ),
  ),
   'subdir' => '/themes/keystone',
   'translations' => 
  array (
  ),
   'special' => 
  array (
    'plugin' => 'Vanilla\\Themes\\Keystone\\KeystoneThemeHooks',
    'config' => '/settings/configuration.php',
  ),
));
