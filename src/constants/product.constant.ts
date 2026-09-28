enum STATUS { AVAILABLE = 'available', OUT_OF_STOCK = 'out-of-stock', DISCONTINUED = 'discontinued' }
enum ACTION { DELETEALL = 'delete-all', RESTOREALL = 'restore-all', DELETEALLFOREVER = 'delete-forever' }
export default { STATUS, ACTION }