const buildCategoryTree = (categories: any[], parentId: string | null = null): any[] => {
  const tree: any[] = []

  for (const category of categories) {
    const categoryParentId = category.parentId ? category.parentId.toString() : null
    const currentParentId = parentId ? parentId.toString() : null

   
    if (categoryParentId === currentParentId) {
    
        const children = buildCategoryTree(categories, category._id.toString())

        const categoryObj = category.toObject ? category.toObject() : { ...category }

        if (children.length > 0) {
            categoryObj.children = children
        } else {
            categoryObj.children = []
        }

        tree.push(categoryObj)
        }
  }

  return tree
}

export default buildCategoryTree