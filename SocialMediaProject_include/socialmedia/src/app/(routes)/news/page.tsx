'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ExternalLink, Clock, Newspaper, AlertCircle, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '@/lib/interceptor'

// type structure for each article...
interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  creator?: string[];
  content?: string;
  description?: string;
  full_description?: string;
  image_url?: string;
  category?: string[];
  country?: string[];
  language?: string;
  keywords?: string[];
  video_url?: string;
  ai_region?: string;
  ai_org?: string;
  ai_tag?: string;
  sentiment?: string;
  sentiment_stats?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
}

// response structure of backend api...
interface NewsResponse {
  totalResults: number;
  results: NewsArticle[];
  nextPage?:string;
}

export default function Newspage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('n') || '';
  const category = searchParams.get('cat') || '';
  const [loading, setloading] = useState<boolean>(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

// Sample data - 6 random news articles for testing
const sampleArticles: NewsArticle[] = [
  {
    title: "Breaking: AI Breakthrough Achieves Human-Level Reasoning",
    link: "https://example.com/ai-breakthrough-2024",
    pubDate: "2024-10-15T10:30:00Z",
    source_id: "TechCrunch",
    creator: ["Dr. Elena Vasquez"],
    description: "Researchers unveil AGI model that solves complex problems indistinguishable from human cognition.",
    content: "In a landmark announcement, the AI Research Institute has demonstrated a system capable of...",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: ["Technology", "AI"],
    country: ["USA"],
    language: "en",
    keywords: ["AI", "AGI", "breakthrough", "artificial intelligence"],
    sentiment: "positive",
    sentiment_stats: { positive: 0.85, negative: 0.05, neutral: 0.10 }
  },
  {
    title: "Global Markets Surge After US Fed Rate Cut Decision",
    link: "https://example.com/fed-rate-cut-markets",
    pubDate: "2024-10-15T09:15:00Z",
    source_id: "Bloomberg",
    creator: ["Financial Desk"],
    description: "Dow Jones up 2.5%, Nasdaq climbs 3.1% as investors celebrate unexpected 50bps cut.",
    content: "Wall Street erupted in cheers as the Federal Reserve delivered a larger-than-expected...",
    image_url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=400&fit=crop",
    category: ["Finance", "Economy"],
    country: ["USA"],
    language: "en",
    keywords: ["Fed", "rate cut", "stocks", "markets"],
    sentiment: "positive",
    sentiment_stats: { positive: 0.78, negative: 0.12, neutral: 0.10 }
  },
  {
    title: "Climate Summit Ends Without Binding Emissions Targets",
    link: "https://example.com/climate-summit-failure",
    pubDate: "2024-10-15T08:45:00Z",
    source_id: "The Guardian",
    creator: ["Climate Editor"],
    description: "COP29 concludes with vague promises but no concrete commitments from major polluters.",
    content: "Environmental groups expressed deep disappointment as world leaders failed to agree on...",
    image_url: "https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?w=800&h=400&fit=crop",
    category: ["Environment", "Politics"],
    country: ["Global"],
    language: "en",
    keywords: ["climate", "COP29", "emissions", "environment"],
    sentiment: "negative",
    sentiment_stats: { positive: 0.10, negative: 0.80, neutral: 0.10 }
  },
  {
    title: "New Quantum Chip Promises Revolution in Computing Power",
    link: "https://example.com/quantum-chip-revolution",
    pubDate: "2024-10-15T07:20:00Z",
    source_id: "Wired",
    creator: ["Tech Correspondent"],
    description: "Google's latest quantum processor achieves error-corrected computation for first time.",
    content: "The era of practical quantum computing may have arrived with Google's breakthrough...",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
    category: ["Technology", "Quantum"],
    country: ["USA"],
    language: "en",
    keywords: ["quantum", "computing", "Google", "chip"],
    sentiment: "positive",
    sentiment_stats: { positive: 0.82, negative: 0.08, neutral: 0.10 }
  },
  {
    title: "SpaceX Starship Test Flight Explodes Mid-Air",
    link: "https://example.com/starship-explosion",
    pubDate: "2024-10-15T06:10:00Z",
    source_id: "Space.com",
    creator: ["Elon Musk Updates"],
    description: "Latest prototype disintegrates 2 minutes into flight, marking 4th failure this year.",
    content: "Live streams captured the dramatic fireball as SpaceX's massive rocket suffered another...",
    image_url: "https://images.unsplash.com/photo-1568500216-2883ca8c7b3f?w=800&h=400&fit=crop",
    video_url: "https://example.com/starship-explosion-video",
    category: ["Space", "Technology"],
    country: ["USA"],
    language: "en",
    keywords: ["SpaceX", "Starship", "explosion", "rocket"],
    sentiment: "negative",
    sentiment_stats: { positive: 0.15, negative: 0.75, neutral: 0.10 }
  },
  {
    title: "EU Regulators Approve World's First Gene-Edited Baby Policy",
    link: "https://example.com/eu-gene-editing-babies",
    pubDate: "2024-10-15T05:30:00Z",
    source_id: "BBC News",
    creator: ["Science Team"],
    description: "Controversial framework allows limited CRISPR applications in human embryos.",
    content: "European lawmakers have greenlit the most progressive genetic engineering policy...",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    category: ["Science", "Ethics", "Health"],
    country: ["EU"],
    language: "en",
    keywords: ["CRISPR", "gene editing", "babies", "EU"],
    sentiment: "neutral",
    sentiment_stats: { positive: 0.40, negative: 0.35, neutral: 0.25 }
  }];

  const [nextPageToken, setNextPageToken] = useState<string>(''); 
  const [currentArticlesPage, setCurrentArticlesPage] = useState(1); 
  const articlesPerPage:number = 12;

  // function for getting news data...
  async function getNewsDataFromApi() {
    try {
      setloading(true);
      const newsApi = await axiosInstance.post('/api/news',{ title:searchQuery , page:nextPageToken || '' , category });
      if (newsApi.status === 200) {
        const apidata : NewsResponse =  newsApi.data;
        if (newsApi.status === 200) {
          setArticles(prev => [...prev, ...apidata.results]);
          setNextPageToken(apidata.nextPage || '');
          setCurrentArticlesPage(prev => prev + 1);
          setloading(false)
        }
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
      toast.error('Error occured in fetching news...')
    }
  }

  useEffect(() => {
    getNewsDataFromApi();
  }, [searchQuery, category]);
  
  // for converting date in common pattern...
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // getting news sentiment color...
const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      case 'negative': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      case 'neutral': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50';
    }
  };

  return (
  <div className="h-screen bg-white dark:bg-black relative flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-white dark:bg-black shadow-md sticky top-0 z-50 rounded-md">
        <div className="w-full mx-auto p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-1 flex-1">
              <div>
                <Newspaper className="w-8 h-8 text-black dark:invert" />
              </div>
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <h1 className="text-xl lg:text-2xl font-poppins font-black text-black dark:text-white">
                  News Info
                </h1>
                {searchQuery && (
                  <span className="px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-lg whitespace-nowrap truncate max-w-xs">
                    {searchQuery.replaceAll('-', ' ')}
                  </span>
                )}
              </div>
            </div>  
           <div className="flex items-center gap-4 flex-shrink-0">
             {category && (
               <span className="px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-lg border border-yellow-500/50">
                 {category}
               </span>
             )}
             <div className="flex items-center py-1 px-3 gap-1 bg-yellow-400 text-black text-sm font-bold rounded-xl border-2 border-yellow-500/50 w-fit justify-center">
               <span>Page</span><span>{currentArticlesPage}</span>
             </div>
           </div>
         </div>
       </div>
     </div>



      {/* Main Content */}
      <div className="w-full h-full flex-1 rounded-lg mx-auto p-2 overflow-auto flex flex-col">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-950 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center gap-2 h-1/4 rounded-lg">
                <div className='flex items-center justify-center gap-2'>
                  <AlertCircle className="w-16 h-16" />
                  <p className="text-lg">No articles found. Try a different News title.</p>
                </div>
                <span 
                onClick={getNewsDataFromApi}
                className='border border-black w-1/5 p-2 rounded-lg bg-black dark:invert hover:scale-105 text-white cursor-pointer'>
                  Try Again
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, index) => (
                    <article key={index} className="bg-white dark:bg-gray-950 cursor-pointer rounded-xl shadow-lg hover:shadow-2xl hover:border-yellow-200 dark:hover:border-yellow-800/50 border-2 border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full group hover:-translate-y-1">
                      {article.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs rounded-full font-medium border border-yellow-200 dark:border-yellow-800/50">
                            {article.source_id}
                          </span>
                          {article.sentiment && (
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSentimentColor(article.sentiment)}`}>
                              {article.sentiment}
                            </span>
                          )}
                          {article.category && article.category[0] && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                              {article.category[0]}
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 transition-colors">
                          <Link href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </Link>
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.description || article.content || 'No description available'}
                        </p>
                        
                        <div className="mt-auto space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            {article.creator && article.creator[0] && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{article.creator[0]}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.pubDate)}</span>
                            </div>
                          </div>
                          
                          {article.keywords && article.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.keywords.slice(0, 3).map((keyword, i) => (
                                <Link 
                                 href={`/explore?n=${encodeURIComponent(`#${keyword}`)}&utm_source=news-page-card`}
                                 key={i} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full ">
                                  #{keyword}
                                </Link>
                              ))}
                            </div>
                          )}
                          
                          <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-semibold text-sm mt-2 group transition-colors"
                          >
                            Read more
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => { getNewsDataFromApi() }}
                      disabled={!nextPageToken}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-950 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-yellow-50 hover:border-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                      <span>Load More</span>
                    </button>
                  </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}