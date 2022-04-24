// components/miCount/mi-count.js
Component({
	/**
	 * 组件的属性列表，对外公开的属性值
	 */
	properties: {
		count: {
			type: Number,
			value: 1
		},
		maxCount: {
			type: Number,
			value: 5
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
		decrease: function() {
			this.triggerEvent('decrease', null, {bubbles: true});// 允许事件冒泡
		},
		increase: function() {
			this.triggerEvent('increase', null, {bubbles: true});
		}
	}
})
