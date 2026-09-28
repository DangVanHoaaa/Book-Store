enum PERMISSIONACTION {
  GET = 'get', CREATE = 'create', UPDATE = 'update', DELETE = 'delete'
}
enum PERMISSIONMODULE {
  PRODUCT = 'product', CATEGORY = 'category', USER = 'user',
  ORDER = 'order', AUTHOR = 'author', SERIES = 'series', ROLE = 'role'
}
enum STATUS { ACTIVE = 'active', INACTIVE = 'inactive' }
export default { PERMISSIONACTION, PERMISSIONMODULE, STATUS }