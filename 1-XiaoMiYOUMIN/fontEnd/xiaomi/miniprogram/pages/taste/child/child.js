// pages/taste/child/child.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		num: 10
	},

	options: {
		multipleSlots: true
	},
	behaviors: ["wx://component-export"],
	export() {
		return {
			num: this.data.num,
			changeNum: num => {
				this.setData({num});
			}
		};
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
