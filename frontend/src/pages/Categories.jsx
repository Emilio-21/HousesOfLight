import { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';
import { getCategories } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = activeTab === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === activeTab);

  return (
    <div className="min-h-screen" data-testid="categories-page">
      {/* Header */}
      <div className="border-b border-black/10 py-12 px-6 sm:px-12 lg:px-24">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Explorar</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">Categorías</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-black/10 px-6 sm:px-12 lg:px-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto p-0 bg-transparent rounded-none border-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4 text-xs uppercase tracking-widest"
              data-testid="tab-all"
            >
              Todas
            </TabsTrigger>
            <TabsTrigger
              value="topic"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4 text-xs uppercase tracking-widest"
              data-testid="tab-topics"
            >
              Temas
            </TabsTrigger>
            <TabsTrigger
              value="series"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4 text-xs uppercase tracking-widest"
              data-testid="tab-series"
            >
              Series
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Categories Grid */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-100 skeleton" />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-8" data-testid="categories-count">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <div key={category.id} className={`stagger-${(index % 6) + 1}`}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state" data-testid="empty-categories">
            <p className="text-gray-500 text-sm uppercase tracking-widest">No hay categorías disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
