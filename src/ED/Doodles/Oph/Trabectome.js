/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Trabectome
 *
 * @class Trabectome
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Trabectome = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Trabectome";

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Trabectome.prototype = new ED.Doodle;
ED.Trabectome.prototype.constructor = ED.Trabectome;
ED.Trabectome.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Trabectome.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.Trabectome.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isArcSymmetrical = true;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 16, Math.PI);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Trabectome.prototype.setParameterDefaults = function() {
	this.arc = Math.PI / 4;
	this.setRotationWithDisplacements(-90, -120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Trabectome.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Trabectome.superclass.draw.call(this, _point);

	// Radius of outer curve and inner curve
	var ro = 440;
	var ri = 400;

	// Dimensions of instrument
	var vo = 500;
	var sw = 10;
	var sl = 760;
	var cl = 100;
	var hw = 150;
	var hl = 170;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of Trabectome
	var rm = (ro + ri) / 2;
	var topRightX = rm * Math.sin(theta);
	var topRightY = -rm * Math.cos(theta);
	var topLeftX = -rm * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// arc back again
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	ctx.moveTo(-sw, vo - (cl + sl));
	ctx.lineTo(0, vo - (cl + sl) - sw);
	ctx.lineTo(sw, vo - (cl + sl));
	ctx.lineTo(sw, vo - cl);
	ctx.lineTo(hw, vo);
	ctx.lineTo(hw, vo + hl);
	ctx.lineTo(-hw, vo + hl);
	ctx.lineTo(-hw, vo);
	ctx.lineTo(-sw, vo - cl);
	ctx.lineTo(-sw, vo - (cl + sl));

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0.8)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Re-do ablation area
		ctx.beginPath();
		ctx.arc(0, 0, ro, arcStart, arcEnd, true);
		ctx.arc(0, 0, ri, arcEnd, arcStart, false);
		ctx.fillStyle = "rgba(200, 100, 100, 0.8)";
		ctx.strokeStyle = "red";
		ctx.fill();
		ctx.stroke();

		// Put in corneal incision
		var cr = 334;
		var cd = 30;
		var cro = cr + cd;
		var cri = cr - cd;
		ctx.beginPath();
		var ctheta = 0.125;
		ctx.arc(0, 0, cro, Math.PI / 2 + ctheta, Math.PI / 2 - ctheta, true);
		ctx.arc(0, 0, cri, Math.PI / 2 - ctheta, Math.PI / 2 + ctheta, false);
		ctx.fillStyle = "rgba(200,200,200,0.75)";
		ctx.strokeStyle = "rgba(120,120,120,0.75)";
		ctx.fill();
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Trabectome.prototype.description = function() {
	return "Trabecular meshwork ablation of " + this.degreesExtent() + " degrees centred around " + this.clockHour() + " o'clock";
}
