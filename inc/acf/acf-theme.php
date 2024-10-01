<?php

/**
 * ACF Theme Options and Scripts
 *
 * @package      mumad
 * @author       fresco y fino
 * @since        1.0.0
 **/

if (!defined('ABSPATH')) {
    exit; # Exit if accessed directly
}

class custom_ACF_Integrations
{

    /**
     * Grupos de Campos
     *
     * @since 1.0.0
     * @public
     * @var array
     */
    public $acf_groups = array(
        'add_page_options',                 # Para habilitar las páginas de configuración propias de la herramienta.
        'add_options_analytics',            # Añadimos las opciones de los pixeles.
        'add_google_maps'                   # Habilitar Google maps dentro de ACF
    );

    /**
     * Constructor.
     *
     * Populates the class.
     *
     * @since 1.0.0
     */
    public function __construct()
    {

        foreach ($this->acf_groups as $key => $func) {
            if (method_exists($this, $func)) {
                //   $this->priority++;
                add_action('acf/init', array($this, $func));
            }
        }
    }

    /**
     * ADD Page OPTIONS
     *
     * This function can be overwritten in the extension that is implemented.
     *
     * @since 1.0.0
     * @void
     */
    public function add_google_maps()
    {
        $google_api = get_field('google_maps_key', 'options');
        acf_update_setting('google_api_key', $google_api);
    }

    /**
     * ADD Page OPTIONS
     *
     * This function can be overwritten in the extension that is implemented.
     *
     * @since 1.0.0
     * @void
     */
    public function add_page_options()
    {

        // Function para crear la pestaña Theme settings
        acf_add_options_page(
            array(
                'page_title' => 'Theme General Settings',
                'menu_title' => 'Theme Settings',
                'menu_slug' => 'theme-general-settings',
                'capability' => 'edit_posts',
                'redirect' => false,
            )
        );

        /////////////// SUBPAGINAS

        // Function para crear subpagina Google (para el GTM)
        acf_add_options_sub_page(
            array(
                'network' => false,
                'page_title' => __('Google & Friends', 'wch'),
                'menu_title' => __('Google & Friends', 'wch'),
                'parent_slug' => 'theme-general-settings',
                'menu_slug' => 'acf-options-analytics',
                'position' => 90,
            )
        );

        // Function para crear subpagina Favicons
        acf_add_options_sub_page(
            array(
                'network' => false,
                'page_title' => __('Contenido', 'wch'),
                'menu_title' => __('Contenido', 'wch'),
                'parent_slug' => 'theme-general-settings',
                'menu_slug' => 'acf-options-content',
                'position' => 50,
            )
        );
    }

    /**
     * ADD Options Analytics
     *
     * Añadimos las opciones de los Pixeles.
     *
     * @since 1.0.0
     * @void
     */
    public function add_options_analytics()
    {

        // campos analitica (códigos header, body y thankyou page)
        acf_add_local_field_group(
            array(
                'key' => 'group_61e7bac612c4a',
                'title' => 'Campos de analítica',
                'fields' => array(
                    array(
                        'key' => 'field_61e7bacd43c38',
                        'label' => 'Codigo header',
                        'name' => 'custom_codigo_header',
                        'type' => 'textarea',
                        'instructions' => 'Códigos de seguimiento para incluir en el "header" general de la web',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '50',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'maxlength' => '',
                        'rows' => '',
                        'new_lines' => '',
                    ),
                    array(
                        'key' => 'field_61e7badf43c39',
                        'label' => 'Codigo body',
                        'name' => 'custom_codigo_body',
                        'type' => 'textarea',
                        'instructions' => 'Códigos de seguimiento para incluir en el "body" general de la web',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '50',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'maxlength' => '',
                        'rows' => '',
                        'new_lines' => '',
                    ),
                    array(
                        'key' => 'field_61e7bc13dedb1',
                        'label' => 'Código página gracias',
                        'name' => 'custom_codigo_pagina_gracias',
                        'type' => 'textarea',
                        'instructions' => 'Códigos de seguimiento para incluir en el "header" de la página de gracias, si la hubiera',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => '',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'acf-options-analytics',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => true,
                'description' => '',
                'show_in_rest' => 0,
            )
        );

        // google maps api key
        acf_add_local_field_group(
            array(
                'key' => 'group_63e3b747c6843',
                'title' => 'Campos Google maps',
                'fields' => array(
                    array(
                        'key' => 'field_63e3b74722160',
                        'label' => 'Google maps key',
                        'name' => 'google_maps_key',
                        'aria-label' => '',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'maxlength' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'acf-options-analytics',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => true,
                'description' => '',
                'show_in_rest' => 0,
            )
        );

    }

}

new custom_ACF_Integrations();

?>