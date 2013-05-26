function KissGraphics(options) {
	var self = this;

	self.utils = new Utils;
}

KissGraphics.prototype.calcPositions = function() {
	var self = this;

	var startX = self.canvas.width() / 2.2;
	var startY = 3 * self.radius / 2;

	$.map(self.states, function(state) {
		if (state.visible) return;

		state.x = startX;
		state.y = startY;
		state.r = self.radius;
		state.visible = true;

		var rgba = "rgba(" + self.utils.getRandInt(0, 245) + ", "
			+ self.utils.getRandInt(0, 245) + ", "
			+ self.utils.getRandInt(0, 245) + ", " + 1 + ")";
		state.color = self.utils.rgb2hex(rgba);
	
		var unqueProducts = [];
		$.map(state.products(), function(el, i) {
    		if($.inArray(el.destination, unqueProducts) === -1 && el.destination != state.name) {
    			var canPush =
    			$.map(self.states, function(st) {
    				if (st.name === el.destination) {
    					return !st.visible;
    				}
    			})[0];
    			if (canPush) unqueProducts.push(el.destination);
    		}
		});

		var childNum = unqueProducts.length;

		startY += 3 * self.radius;
	
		if (childNum > 0)
		{
			startX -= (3*self.radius) * (childNum - 1);

				$.map(unqueProducts, function(productName) {
					$.map(self.states, function(el) {
						if (el.name == productName && !el.visible) {
							el.x = startX;
							el.y = startY;
							el.r = self.radius;
							el.visible = true;
							rgba = "rgba(" + self.utils.getRandInt(0, 245) + ", "
								+ self.utils.getRandInt(0, 245) + ", "
								+ self.utils.getRandInt(0, 245) + ", " + 1 + ")";
							el.color = self.utils.rgb2hex(rgba);
							startX += 2 * (3*self.radius);
						}
					});
				});
	
			startX = self.canvas.width() / 2.2;
			startY += 3 * self.radius;
		}
	});
}

KissGraphics.prototype.drawGraph = function() {
	if (this.states.length == 0) return;

	this.calcPositions();

	this.drawCircles();

	this.drawArrows();
}

KissGraphics.prototype.drawCircles = function() {
	var self = this;

	$.map(self.states, function(state) {
		self.canvas.drawEllipse({
			strokeStyle: state.color,
			strokeWidth: 2,
			fillStyle: "#FFF",
			width: state.r,
			height: state.r,
			x: state.x,
			y: state.y
		});
		self.canvas.drawText({
			font: self.textSize + "pt Verdana, sans-serif",
			fillStyle: state.color,
			x: state.x,
			y: state.y,
			text: state.name
		});
	});
};

KissGraphics.prototype.drawArrows = function() {
	var self = this;

	// Перебираем все состояния
	$.map(self.states, function(start, i) {
		// Поскольку в поле переходов хранится лишь название следующей вершины,
		// а для прорисовки линий необходимы координаты, то необходимо получить
		// объекты, в которых и хранятся координаты вершин к которым будут
		// проводится линии от текущей вершины
		var list =
		$.map(start.products(), function(product) {
			return $.map(self.states, function(el) {
				if (product.destination === el.name) {
					return el;
				}
			});
		});

		var zn = 1;

		// Перебираем все вершины, с которыми связана текущая вершина
		$.map(list, function(end, j) {
			// Получаем массив из элементов true.
			// Если размер полученного массива больше одного,
			// то значит из текущей вершины можно попасть в следующую
			// более чем по одному условию
			var dests =
			$.map(start.products(),
				function(el) {
					if (el.destination == end.name) return true;
				});

			var startX = start.x; // Координата X текущей вершины
			var startY = start.y; // Координата Y текущей вершины

			var endX = end.x; // Координата X следующей вершины
			var endY = end.y; // Координата Y следующей вершины

			var ctrlX = (startX + endX) / 2; // Центр линии изгиба по оси X
			var ctrlY = (startY + endY) / 2; // Центр линии изгиба по оси Y

			var txtX_x = ctrlX; // Координата x для вывода текста x_string
			var txtY_x = ctrlY; // Координата y для вывода текста x_string
			var txtX_y = ctrlX; // Координата x для вывода текста y_string
			var txtY_y = ctrlY; // Координата y для вывода текста y_string
			var txtRotate = 0;  // Угол поворота текста

			// Расстояние между элементами в условных еденицах
			// (по идее это количество пролётов, но с небольшой корректировкой)
			var distY = Math.abs(startY - endY) / (1.5*self.radius) / 1.1;

			// Знак каждый раз инвертируется, если из текущей вершины
			// в следующую можно перейти более чем по одному условию.
			// Это делается для того, чтобы линии не находили друг на друга
			// и рисовались по разные стороны вершин.
			// Если из текущей вершины будет более 2 условий перехода в последующую,
			// То в таком случае будет происходить наложение.
			if (dests.length > 1) zn *= -1;


			// Если следующая (СВ) вершина расположена НИЖЕ текущей (ТВ):
			if (startY < endY) {
				// Если следующая (СВ) вершина расположена СЛЕВА от текущей (ТВ):
				//
				//       (ТВ)
				//     ..
				// (СВ)
				//
				if (startX > endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX += self.radius / 2;
						endX += self.radius / 2;
						ctrlX += self.radius * distY;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						if (zn > 0)
						{
							startY += self.radius / 2;
							endX += self.radius / 2;
						}
						else
						{
							startX -= self.radius / 2;
							endY -= self.radius / 2;
						}
						ctrlX += self.radius * zn;
						ctrlY += self.radius / 2 * zn;
						txtX_x += self.radius / 3.2 * zn;
						txtY_x += self.radius / 3.2 * zn;
						txtX_y += self.radius / 1.6 * zn;
						txtY_y += self.radius / 1.6 * zn;
						txtRotate = -48;
					}
				}
				// Если следующая (СВ) вершина расположена СПРАВА от текущей (ТВ):
				//
				// (ТВ)
				//     ..
				//       (СВ)
				//
				else if (startX < endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;

						txtY_y += self.radius;
						txtX_y -= self.radius * distY / 1.95 * zn;
						txtY_x += self.radius / 1.7;
						txtX_x -= self.radius * distY / 2.2 * zn;						

						txtRotate = -118;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						if (zn > 0)
						{
							startX += self.radius / 2;
							endY -= self.radius / 2;
						}
						else
						{
							startY += self.radius / 2;
							endX -= self.radius / 2;
						}
						
						ctrlX += self.radius * zn;
						ctrlY -= self.radius / 2 * zn;

						txtX_x += self.radius / 3 * zn;
						txtY_x -= self.radius / 3 * zn;
						txtX_y += self.radius / 1.6 * zn;
						txtY_y -= self.radius / 1.5 * zn;

						txtRotate = 42;
					}
				}
				// Если следующая (СВ) вершина расположена ПОД текущей (ТВ):
				//
				//    (ТВ)
				//     ..
				//    (СВ)
				//
				else {// (startX === endX)
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						startY += self.radius / 2;
						endY -= self.radius / 2;

						txtX_x -= self.radius / 5;
						txtX_y += self.radius / 5;

						txtRotate = -90;
					}
				}
			}
			// Если следующая (СВ) вершина расположена ВЫШЕ текущей (ТВ):
			else if (startY > endY) {
				// Если следующая (СВ) вершина расположена СЛЕВА от текущей (ТВ):
				//
				// (СВ)
				//     ..
				//       (ТВ)
				//
				if (startX > endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;

						txtX_x -= (self.radius / 1.94) * distY * zn - 10;
						txtX_y -= (self.radius / 1.94) * distY * zn + 10;

						txtRotate = -110 + (distY*0.6);
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						startX -= self.radius / 2;
						endY += self.radius / 2;
						ctrlX -= self.radius;
						ctrlY += self.radius / 2;

						txtX_x -= self.radius / 1.7;
						txtY_x += self.radius / 1.5;
						txtX_y -= self.radius / 2;
						txtY_y += self.radius / 3;

						txtRotate = -126;
					}
				}
				// Если следующая (СВ) вершина расположена СПРАВА от текущей (ТВ):
				//
				//       (СВ)
				//     ..
				// (ТВ)
				//
				else if (startX < endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX += self.radius / 2 * zn;
						endX += self.radius / 2 * zn;
						ctrlX += self.radius * distY * zn;

						txtX_x += self.radius / 1.8 * distY * zn - distY*1.1 - 10;
						txtX_y += self.radius / 1.8 * distY * zn - distY*1.1 + 10;

						txtRotate = -60 - (distY * 0.5);
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						if (zn > 0) {
							startX += self.radius / 2;
							endY += self.radius / 2;
						}
						else {
							startY -= self.radius / 2;
							endX -= self.radius / 2;
						}
						ctrlY += self.radius / 2 * zn;
						ctrlX += self.radius * zn;

						txtX_x += self.radius / 3.6 * zn;
						txtY_x += self.radius / 2.8 * zn;
						txtX_y += self.radius / 1.8 * zn;
						txtY_y += self.radius / 1.5 * zn;

						txtRotate = -42;
					}
				}
				// Если следующая (СВ) вершина расположена НАД текущей (ТВ):
				//
				//    (СВ)
				//     ..
				//    (ТВ)
				//
				else {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						startX += self.radius / 2 * zn;
						endX += self.radius / 2 * zn;
						ctrlX += self.radius * zn;

						txtX_x += self.radius / 1.7 * zn;
						txtX_y += self.radius / 1.1 * zn;

						txtRotate = -90;
					}
				}
			}
			// Если следующая (СВ) и текущая (ТВ) вершины находятся
			// на одной линии (по горизонту)
			else { // (startY === endY)
				// Если следующая (СВ) вершина расположена СПРАВА от текущей (ТВ):
				//
				// (ТВ) .. (СВ)
				//
				if (startX < endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startY += self.radius / 2 * zn;
						endY += self.radius / 2 * zn;
						ctrlY += self.radius * distY * 0.2 * zn;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						if (zn > 0) {
							startX += self.radius / 2;
							endX -= self.radius / 2;

							txtY_x -= self.radius / 5;
							txtY_y += self.radius / 5;

							txtRotate = 0;
						}
						else {
							startY += self.radius / 2;
							endY += self.radius / 2;
							ctrlY += self.radius;

							txtY_x += self.radius / 1.9;
							txtY_y += self.radius / 1.1;
						}
					}
				}
				// Если следующая (СВ) вершина расположена СЛЕВА от текущей (ТВ):
				//
				// (СВ) .. (ТВ)
				//
				else if (startX > endX) {
					// Если расстояние между элементами БОЛЬШЕ одного пролёта
					if (distY > 2) {
						startY += self.radius / 2 * zn;
						endY += self.radius / 2 * zn;
						ctrlY += self.radius * distY * 0.2 * zn;
					}
					// Если расстояние между элементами состовляет ОДИН пролёт
					else {
						startX -= self.radius / 2;
						endX += self.radius / 2;
					}
				}
				// Если и координаты по X так же равны, значит это переход САМ В СЕБЯ
				else { // (startX === endX)
					startX += self.radius / 2 * zn;
					endY -= self.radius / 2 * zn;
					ctrlX += self.radius * zn;
					ctrlY -= self.radius * zn;

					txtX_x += self.radius / 1.6 * zn;
					txtY_x -= self.radius / 1.2 * zn;
					txtX_y += self.radius / 1.6 * zn;
					txtY_y -= self.radius * 1.1 * zn;

					txtRotate = 0;
				}
			}

			// Рисуем линию связи
			self.canvas.drawQuad({
				strokeStyle: "#36C",
				strokeWidth: 2,
				strokeStyle: start.color,
				opacity: 0.9,
				x1: startX, y1: startY, // Начальная точка
				cx1: ctrlX, cy1: ctrlY, // Контрольная точка (точка изгиба)
				x2: endX, y2: endY 		// Конечная точка
			});

			var options = {
				X_x: txtX_x,
				Y_x: txtY_x,
				X_y: txtX_y,
				Y_y: txtY_y,
				rotate: txtRotate,
				color: start.color,
				x_string: start.products()[j].x_string,
				y_string: start.products()[j].y_string
			};
			self.renderLabels(options)
		});
	});
};

KissGraphics.prototype.renderLabels = function(options) {
	if (this.renderX){
		// Выводим содержимое поля x_string
		this.canvas.drawText({
			fillStyle: options.color,
			strokeWidth: 1,
			x: options.X_x,
			y: options.Y_x,
			font: "6pt",
			fromCenter: true,
			rotate: options.rotate,
			text: options.x_string
		});
	}
	if (this.renderY){
		// Выводим содержимое поля y_string
		this.canvas.drawText({
			fillStyle: options.color,
			strokeWidth: 1,
			x: options.X_y,
			y: options.Y_y,
			font: "6pt",
			fromCenter: true,
			rotate: options.rotate,
			text: options.y_string
		});
	}
};

// KissGraphics.prototype.save = function() {
// 	var c = this.canvas[0];
// 	var d = c.toDataURL("image/png");
// 	var w = window.open('about:blank','image from canvas');
// 	w.document.write("<img src='" + d + "' alt='from canvas'/>");
// };