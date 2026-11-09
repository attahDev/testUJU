export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function toProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    collection: p.collection,
    category: p.category,
    material: p.material,
    image: p.image_url,
    gallery: p.gallery,
    colors: p.colors,
    sizes: p.sizes,
    stock: p.stock,
  };
}

export function toArticle(a) {
  return {
    id: a.slug,
    rawId: a.id,
    tag: a.tag,
    title: a.title,
    author: a.author,
    date: formatDate(a.published_at),
    readTime: a.read_time,
    excerpt: a.excerpt,
    body: a.body,
    image: a.image_url,
  };
}

export function toLook(l) {
  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    description: l.description,
    image: l.image_url,
    totalPence: l.total_pence,
    products: l.products.map(toProduct),
  };
}
