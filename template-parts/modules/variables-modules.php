<?php

// Get Variables Modules / COMUNES
$content = get_sub_field('content');
$media = get_sub_field('media');
$config = get_sub_field('config');
$items = get_sub_field('items');
$extras = get_sub_field('extras');
$buttons = get_sub_field('buttons');

$config_module = '';
$config_style = '';
// $bg_color = $config['bg_color_group']['bg_color'];
// $bg_color_custom = $config['bg_color_group']['bg_custom'];

if (!empty($config['margins']['margin-top'])) {
    $config_module .= ' ' . $config['margins']['margin-top'];
}
if (!empty($config['margins']['margin-bottom'])) {
    $config_module .= ' ' . $config['margins']['margin-bottom'];
}
if (!empty($config['margins']['margin-left'])) {
    $config_module .= ' ' . $config['margins']['margin-left'];
}
if (!empty($config['margins']['margin-right'])) {
    $config_module .= ' ' . $config['margins']['margin-right'];
}

// Slug [Config]
if (!empty($config)) {
    $slug = (!empty($config['slug'])) ? $config['slug'] : '';
}

// Background color
if (!empty($config['bg_color'])) {
    $config_module .= ' ' . $config['bg_color'];
}

// Tema Modulo [Config]
if (!empty($config['bg_image'])) {
    $config_style .= ($config['bg_image']) ? 'background-image: url(' . $config['bg_image']. ');' : '';
}

// // Type [Extras]
// if (!empty($extras['type'])) {
//     $config_module .= ' ' . $extras['type'];
// }

// // Direction [Extras]
// if (!empty($extras['direction'])) {
//     foreach ($extras['direction'] as $direction) {
//         $config_module .= ' ' . $direction;
//     }
// }