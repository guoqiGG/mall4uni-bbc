<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <div class="tablebox">
    <rich-text :nodes="nodes" :class="node.classStr" :style="'user-select:' + parseSelect" />
  </div>
</template>
<script>
export default {
  name: 'WxParseTable',
  inject: ['parseSelect'],
  props: {
    node: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      nodes: []
    }
  },
  mounted() {
    this.nodes = this.loadNode([this.node])
  },
  methods: {
    loadNode(node) {
      console.log(node)
      const obj = []
      for (const children of node) {
        if (children.node == 'element') {
          const t = {
            name: children.tag,
            attrs: {
              class: children.classStr,
              style: children.styleStr
            },
            children: children.nodes ? this.loadNode(children.nodes) : []
          }

          obj.push(t)
        } else if (children.node == 'text') {
          obj.push({
            type: 'text',
            text: children.text
          })
        }
      }
      return obj
    }
  }
}
</script>
<style>
	@import url("../parse.css");
</style>
