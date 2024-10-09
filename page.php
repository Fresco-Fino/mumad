<?php get_header(''); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<div class="pt-extralarge pb-large plr-medium">
    	<h1><?php the_title(); ?></h1>
		<div class="pt-small">
			<?php the_content(); ?>
		</div>    	
	</div>
<?php endwhile; endif; ?>

<?php get_footer(); ?>