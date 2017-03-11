/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 4;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);

	this.Unistrokes[0] = new Unistroke("s", new Array(new Point(-120,-3),new Point(-125,9),new Point(-126,20),new Point(-126,31),new Point(-126,43),new Point(-125,53),new Point(-121,64),new Point(-118,74),new Point(-114,85),new Point(-109,95),new Point(-104,104),new Point(-98,113),new Point(-90,114),new Point(-81,113),new Point(-72,113),new Point(-63,110),new Point(-54,108),new Point(-45,105),new Point(-36,102),new Point(-27,97),new Point(-19,92),new Point(-11,86),new Point(-4,79),new Point(3,73),new Point(10,65),new Point(14,56),new Point(15,45),new Point(13,34),new Point(11,23),new Point(8,12),new Point(6,1),new Point(4,-9),new Point(2,-20),new Point(0,-31),new Point(-4,-41),new Point(-5,-52),new Point(-5,-64),new Point(-5,-73),new Point(-2,-84),new Point(3,-93),new Point(9,-101),new Point(13,-111),new Point(20,-119),new Point(27,-126),new Point(35,-132),new Point(43,-135),new Point(51,-130),new Point(58,-122),new Point(64,-114),new Point(69,-104),new Point(75,-95),new Point(80,-86),new Point(86,-77),new Point(91,-67),new Point(96,-58),new Point(102,-49),new Point(106,-39),new Point(109,-28),new Point(113,-18),new Point(116,-7),new Point(119,2),new Point(122,12),new Point(123,22),new Point(116,29))); 
	this.Unistrokes[1] = new Unistroke("u", new Array(new Point(-132,1),new Point(-125,7),new Point(-117,16),new Point(-115,26),new Point(-108,35),new Point(-102,43),new Point(-96,52),new Point(-91,62),new Point(-84,70),new Point(-77,78),new Point(-70,87),new Point(-64,96),new Point(-57,104),new Point(-49,112),new Point(-40,118),new Point(-31,119),new Point(-20,118),new Point(-11,113),new Point(-2,106),new Point(4,99),new Point(12,91),new Point(20,83),new Point(27,75),new Point(35,68),new Point(43,60),new Point(48,50),new Point(49,39),new Point(49,28),new Point(50,17),new Point(51,6),new Point(51,-4),new Point(49,-14),new Point(45,-24),new Point(38,-32),new Point(32,-42),new Point(25,-50),new Point(18,-58),new Point(11,-66),new Point(5,-76),new Point(0,-85),new Point(-3,-95),new Point(-8,-105),new Point(-13,-115),new Point(-19,-124),new Point(-26,-130),new Point(-18,-122),new Point(-13,-113),new Point(-9,-103),new Point(-3,-94),new Point(2,-85),new Point(8,-75),new Point(15,-67),new Point(22,-59),new Point(30,-51),new Point(37,-43),new Point(44,-35),new Point(52,-27),new Point(60,-20),new Point(70,-16),new Point(80,-13),new Point(90,-10),new Point(101,-8),new Point(109,-6),new Point(117,-9))); 
	this.Unistrokes[2] = new Unistroke("h", new Array(new Point(-136,-2),new Point(-128,6),new Point(-120,8),new Point(-112,9),new Point(-103,11),new Point(-95,15),new Point(-87,18),new Point(-79,23),new Point(-71,27),new Point(-63,31),new Point(-55,35),new Point(-47,38),new Point(-39,44),new Point(-31,51),new Point(-23,57),new Point(-16,63),new Point(-8,70),new Point(0,76),new Point(7,82),new Point(15,89),new Point(22,95),new Point(30,102),new Point(38,111),new Point(45,120),new Point(53,127),new Point(61,133),new Point(53,127),new Point(45,121),new Point(38,114),new Point(31,102),new Point(25,89),new Point(18,79),new Point(11,69),new Point(4,59),new Point(-1,45),new Point(-8,33),new Point(-15,23),new Point(-21,11),new Point(-27,-3),new Point(-31,-17),new Point(-35,-33),new Point(-37,-53),new Point(-36,-71),new Point(-34,-90),new Point(-27,-101),new Point(-19,-106),new Point(-11,-110),new Point(-3,-108),new Point(4,-111),new Point(12,-115),new Point(21,-116),new Point(29,-115),new Point(37,-113),new Point(45,-111),new Point(53,-108),new Point(62,-105),new Point(70,-102),new Point(78,-99),new Point(86,-96),new Point(94,-92),new Point(102,-89),new Point(110,-85),new Point(113,-83),new Point(105,-89)));
	this.Unistrokes[3] = new Unistroke("i", new Array(new Point(-121,-9),new Point(-121,-99),new Point(-119,-148),new Point(-115,-152),new Point(-111,-156),new Point(-107,-159),new Point(-103,-150),new Point(-99,-137),new Point(-95,-125),new Point(-91,-112),new Point(-87,-98),new Point(-83,-81),new Point(-79,-63),new Point(-75,-45),new Point(-71,-28),new Point(-67,-10),new Point(-63,7),new Point(-59,13),new Point(-55,9),new Point(-51,5),new Point(-47,1),new Point(-42,-2),new Point(-38,-2),new Point(-34,4),new Point(-30,11),new Point(-26,18),new Point(-22,25),new Point(-18,32),new Point(-14,40),new Point(-10,48),new Point(-6,56),new Point(-2,64),new Point(1,73),new Point(5,81),new Point(9,90),new Point(13,89),new Point(18,85),new Point(22,81),new Point(26,77),new Point(30,73),new Point(34,69),new Point(38,65),new Point(42,61),new Point(46,57),new Point(50,53),new Point(54,49),new Point(58,45),new Point(62,41),new Point(66,38),new Point(71,34),new Point(75,30),new Point(79,26),new Point(83,22),new Point(87,18),new Point(91,14),new Point(95,10),new Point(99,6),new Point(103,2),new Point(107,-1),new Point(111,-5),new Point(115,-9),new Point(119,-12),new Point(124,-16),new Point(128,-20)));  
	
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }