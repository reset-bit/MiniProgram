// pages/cart/checkbox/cart-checkbox.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		checked: {
			type: Boolean
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		toggleChecked: function() {
			this.triggerEvent("toggleChecked", null, {bubbles: true});
		}
	}
})
