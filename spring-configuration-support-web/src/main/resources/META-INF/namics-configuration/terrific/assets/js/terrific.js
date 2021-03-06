/**
 * Terrific JavaScript Framework v2.0.1
 * http://terrifically.org
 *
 * Copyright 2012, Remo Brunschwiler
 * MIT Licensed.
 *
 * Date: Mon, 10 Sep 2012 13:44:44 GMT
 *
 *
 * Includes:
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * @module Tc
 *
 */
var Tc = Tc || {};
Tc.$ = $, function () {
	var a = !1, b = /xyz/.test(function () {
		xyz
	}) ? /\b_super\b/ : /.*/;
	this.Class = function () {
	}, Class.extend = function (c) {
		function g() {
			!a && this.init && this.init.apply(this, arguments)
		}

		var d = this.prototype;
		a = !0;
		var e = new this;
		a = !1;
		for (var f in c)e[f] = typeof c[f] == "function" && typeof d[f] == "function" && b.test(c[f]) ? function (a, b) {
			return function () {
				var c = this._super;
				this._super = d[a];
				var e = b.apply(this, arguments);
				return this._super = c, e
			}
		}(f, c[f]) : c[f];
		return g.prototype = e, g.constructor = g, g.extend = arguments.callee, g
	}
}(), Tc.Config = {dependencies: {css: "/css/dependencies", js: "/js/dependencies"}}, function (a) {
	"use strict", Tc.Application = Class.extend({init: function (b, c) {
		this.config = a.extend(Tc.Config, c), this.$ctx = b || a("body"), this.modules = [], this.connectors = {}, this.sandbox = new Tc.Sandbox(this, this.config)
	}, registerModules: function (b) {
		var c = this, d = [], e = Tc.Utils.String;
		return b = b || this.$ctx, b.find('.mod:not([data-ignore="true"])').each(function () {
			var b = a(this), f = b.attr("class").split(" ");
			if (f.length > 1) {
				var g, h = [], i = [], j;
				for (var k = 0, l = f.length; k < l; k++) {
					var m = a.trim(f[k]);
					m && (m.indexOf("-") > -1 && (m = e.toCamel(m)), m.indexOf("mod") === 0 && m.length > 3 ? g = m.substr(3) : m.indexOf("skin") === 0 && h.push(m.substr(4).replace(g, "")))
				}
				j = b.attr("data-connectors");
				if (j) {
					i = j.split(",");
					for (var k = 0, l = i.length; k < l; k++) {
						var n = a.trim(i[k]);
						n && (i[k] = n)
					}
				}
				g && Tc.Module[g] && d.push(c.registerModule(b, g, h, i))
			}
		}), d
	}, unregisterModules: function (b) {
		var c = this.connectors;
		b = b || this.modules;
		if (b === this.modules)this.connectors = [], this.modules = []; else for (var d = 0, e = b.length; d < e; d++) {
			var f = b[d], g;
			for (var h in c)c.hasOwnProperty(h) && c[h].unregisterComponent(f);
			g = a.inArray(f, this.modules), g > -1 && delete this.modules[g]
		}
	}, start: function (a) {
		a = a || this.modules;
		for (var b = 0, c = a.length; b < c; b++)a[b].start()
	}, stop: function (a) {
		a = a || this.modules;
		for (var b = 0, c = a.length; b < c; b++)a[b].stop()
	}, registerModule: function (a, b, c, d) {
		var e = this.modules;
		b = b || undefined, c = c || [], d = d || [];
		if (b && Tc.Module[b]) {
			var f = e.length;
			a.data("id", f), e[f] = new Tc.Module[b](a, this.sandbox, f);
			for (var g = 0, h = c.length; g < h; g++) {
				var i = c[g];
				Tc.Module[b][i] && (e[f] = e[f].getDecoratedModule(b, i))
			}
			for (var g = 0, h = d.length; g < h; g++)this.registerConnection(d[g], e[f]);
			return e[f]
		}
		return null
	}, registerConnection: function (b, c) {
		b = a.trim(b);
		var d = b.split("-"), e, f, g;
		d.length === 1 ? g = f = d[0] : d.length === 2 && (e = d[0], f = d[1], g = e + f);
		if (g) {
			var h = this.connectors;
			h[g] || (e ? Tc.Connector[e] && (h[g] = new Tc.Connector[e](f)) : h[g] = new Tc.Connector(f)), h[g] && (c.attachConnector(h[g]), h[g].registerComponent(c))
		}
	}, unregisterConnection: function (a, b) {
		var c = this.connectors[a];
		c && (c.unregisterComponent(b), b.detachConnector(c))
	}})
}(Tc.$), function (a) {
	"use strict", Tc.Sandbox = Class.extend({init: function (a, b) {
		this.application = a, this.config = b, this.afterCallbacks = []
	}, addModules: function (a) {
		var b = [], c = this.application;
		return a && (b = c.registerModules(a), c.start(b)), b
	}, removeModules: function (a) {
		var b = this.application;
		a && (b.stop(a), b.unregisterModules(a))
	}, subscribe: function (a, b) {
		var c = this.application;
		b instanceof Tc.Module && a && (a += "", c.registerConnection(a, b))
	}, unsubscribe: function (a, b) {
		var c = this.application;
		b instanceof Tc.Module && a && (a += "", c.unregisterConnection(a, b))
	}, getModuleById: function (a) {
		var b = this.application;
		if (b.modules[a] !== undefined)return b.modules[a];
		throw new Error("the module with the id " + a + " does not exist")
	}, getConfig: function () {
		return this.config
	}, getConfigParam: function (a) {
		var b = this.config;
		if (b[a] !== undefined)return b[a];
		throw new Error("the config param " + a + " does not exist")
	}, ready: function (a) {
		var b = this.afterCallbacks;
		b.push(a);
		if (this.application.modules.length === b.length)for (var c = 0; c < b.length; c++) {
			var d = b[c];
			typeof d == "function" && (delete b[c], d())
		}
	}})
}(Tc.$), function (a) {
	"use strict", Tc.Module = Class.extend({init: function (a, b, c) {
		this.$ctx = a, this.id = c, this.connectors = {}, this.sandbox = b
	}, start: function () {
		var a = this;
		this.on && this.on(function () {
			a.initAfter()
		})
	}, stop: function () {
		var b = this.$ctx;
		a("*", b).unbind().removeData(), b.unbind().removeData()
	}, initAfter: function () {
		var a = this;
		this.sandbox.ready(function () {
			a.after && a.after()
		})
	}, fire: function (b, c, d, e) {
		var f = this, g = this.connectors, h = !0;
		d == null && e == null ? typeof c == "function" ? (e = c, c = undefined) : a.isArray(c) && (d = c, c = undefined) : e == null && (typeof d == "function" && (e = d, d = undefined), a.isArray(c) && (d = c, c = undefined)), b = Tc.Utils.String.capitalize(b), c = c || {}, d = d || Object.keys(g);
		for (var i = 0, j = d.length; i < j; i++) {
			var k = d[i];
			if (!g.hasOwnProperty(k))throw new Error("the module #" + f.id + " is not connected to connector " + k);
			var l = g[k], m = l.notify(f, "on" + b, c) || !1;
			m || (h = !1)
		}
		h && typeof e == "function" && e()
	}, attachConnector: function (a) {
		this.connectors[a.connectorId] = a
	}, detachConnector: function (a) {
		delete this.connectors[a.connectorId]
	}, getDecoratedModule: function (a, b) {
		if (Tc.Module[a][b]) {
			var c = Tc.Module[a][b];
			return c.prototype = this, c.prototype.constructor = Tc.Module[a][b], new c(this)
		}
		return null
	}})
}(Tc.$), function (a) {
	"use strict", Tc.Connector = Class.extend({init: function (a) {
		this.connectorId = a, this.components = {}
	}, registerComponent: function (a) {
		this.components[a.id] = {component: a}
	}, unregisterComponent: function (a) {
		var b = this.components;
		b[a.id] && delete b[a.id]
	}, notify: function (a, b, c, d) {
		var e = !0, f = this.components;
		for (var g in f)if (f.hasOwnProperty(g)) {
			var h = f[g].component;
			h !== a && h[b] && h[b](c) === !1 && (e = !1)
		}
		return e
	}})
}(Tc.$), Tc.Utils = {}, Object.keys || (Object.keys = function (a) {
	var b = [], c;
	for (c in a)Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
	return b
}), function (a) {
	"use strict", Tc.Utils.String = {capitalize: function (a) {
		return a.substr(0, 1).toUpperCase().concat(a.substr(1))
	}, toCamel: function (a) {
		return a.replace(/(\-[A-Za-z])/g, function (a) {
			return a.toUpperCase().replace("-", "")
		})
	}}
}(Tc.$);