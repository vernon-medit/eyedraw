<div style="float:left; width: <?php echo ($width+20)?>px; height: <?php echo ($height+20)?>px;">
<!-- Uncomment following line to re-enable doodle hover tooltips once layer bug is fixed (OE-1583) -->
<!-- <span id="canvasTooltip"></span> -->
	<canvas id="<?php echo $canvasId?>" class="<?php if ($isEditable) { echo 'edit'; } else { echo 'display'; }?>" width="<?php echo $width?>" height="<?php echo $height?>" tabindex="1"<?php if ($canvasStyle) {?> style="<?php echo $canvasStyle?>"<?php }?>></canvas>
	<input type="hidden" id="<?php echo $inputId?>" name="<?php echo $inputName?>" value='<?php echo $this->model[$this->attribute]?>' />
</div>
<?php if ($isEditable) {?>
	<div style="float: left">
		<div class="ed_toolbar">
			<button class="ed_img_button" disabled="disabled" id="moveToFront<?php echo $idSuffix?>" title="Move to front" onclick="<?php echo $drawingName?>.moveToFront(); return false;">
				<img src="<?php echo $imgPath?>moveToFront.gif" />
			</button>
			<button class="ed_img_button" disabled="disabled" id="moveToBack<?php echo $idSuffix?>" title="Move to back" onclick="<?php echo $drawingName?>.moveToBack(); return false;">
				<img src="<?php echo $imgPath?>moveToBack.gif" />
			</button>
			<button class="ed_img_button" disabled="disabled" id="deleteDoodle<?php echo $idSuffix?>" title="Delete" onclick="<?php echo $drawingName?>.deleteDoodle(); return false;">
				<img src="<?php echo $imgPath?>deleteDoodle.gif" />
			</button>
			<button class="ed_img_button" disabled="disabled" id="lock<?php echo $idSuffix?>" title="Lock" onclick="<?php echo $drawingName?>.lock(); return false;">
				<img src="<?php echo $imgPath?>lock.gif" />
			</button>
			<button class="ed_img_button" id="unlock<?php echo $idSuffix?>" title="Unlock" onclick="<?php echo $drawingName?>.unlock(); return false;">
				<img src="<?php echo $imgPath?>unlock.gif" />
			</button>
		</div>
    <?php if ($isEditable && count($doodleToolBarArray) > 0) {
      foreach ($doodleToolBarArray as $row => $rowItems) {?>
				<div class="ed_toolbar">
					<?php foreach ($rowItems as $item) {?>
						<button class="ed_img_button" id="<?php echo $item['classname'].$idSuffix?>" title="<?php echo $item['title']?>" onclick="<?php echo $drawingName?>.addDoodle('<?php echo $item['classname']?>'); return false;">
							<img src="<?php echo $imgPath.$item['classname']?>.gif" />
						</button>
					<?php }?>
				</div>
			<?php }
		}?>
	</div>
<?php }?>