

<footer class="site-footer">

    <?php // Footer inside ?>
    <div class="site-footer__inside">

        <div class="site-footer__contact">

            <img src="<?php bloginfo('template_url') ?>/dist/assets/logos/brand-imagotipo.png" alt="">

            <div>
                <p>
                Paseo del comandante fortea 46<br/>
                <a href="#" target="_blank">ver en Google Maps</a><br/>
                666 777 888 · hola@mumad.com
                </p>
            </div>

        </div>

        <?php get_template_part('template-parts/menus/social'); ?>  

    </div>
    
    <?php // Footer Bottom ?>
    <div class="site-footer__bottom">
        <?php get_template_part('template-parts/menus/legal'); ?>  
    </div>

</footer>

<?php // Custom Cursor ?>
<?php get_template_part('template-parts/components/cursor'); ?>  