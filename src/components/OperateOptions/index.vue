<template>
  <el-row>
    <el-dropdown
      v-if="dropdownVisable"
      :key="row.id"
      type="default"
      trigger="click"
      @command="handleParentAction"
    >
      <el-button type="default" size="mini">
        Options <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="value in options"
          :key="value.title"
          :command="value.component"
        >
          {{ value.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button-group v-if="buttonVisable">
      <el-button
        v-for="(value, index) in options"
        :key="index"
        type="default"
        size="mini"
        @click="handleParentAction(value.component)"
      >{{ value.title }}</el-button>
    </el-button-group>
  </el-row>
</template>

<script>
// this page not yet finish
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dropdownVisable: false,
      buttonVisable: true
    }
  },
  created() {
    // no put the create options at lists
    this.options.forEach(function(item, index, array) {
      if (item.component === 'create') {
        array.pop(item)
      }
    })
    if (this.options.length > 2) {
      this.dropdownVisable = true
      this.buttonVisable = false
    } else {
      this.dropdownVisable = false
      this.buttonVisable = true
    }
  },
  methods: {
    handleParentAction(command) {
      this.$emit('action', command, this.row)
    }
  }
}
</script>
