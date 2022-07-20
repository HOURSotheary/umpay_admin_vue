/**
 * Common funcion
 */
export function handleAfterRequest(response) {
  if (response.status === 200) {
    this.$message({
      message: ' Successfully!',
      type: 'success'
    })
    // this.$parent.closeDrawer()
  } else {
    let messageError = ''
    Object.keys(response.data).forEach(function(key) {
      messageError += '\n' + response.data[key][0]
    })
    this.$message({
      message: ' Failed!' + '\n' + messageError,
      type: 'warning'
    })
  }
}
