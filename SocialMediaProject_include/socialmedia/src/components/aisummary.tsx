'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SparklesIcon, Copy, Check, RefreshCw, Share2, Download, ThumbsUp, ThumbsDown, FileText, Hash, AtSign, BarChart3, TrendingUp, Users, MessageCircle, Heart, Eye, Repeat2, Bookmark, Calendar, MapPin, Link2, Quote, Lightbulb, Target, Zap, AlertCircle, Shield, Globe, Clock, UserCheck, Activity, PieChart, Video, Image , File, ExternalLink, Send, Star, Flag, HelpCircle, Info, Smile, Frown, Meh, Bot, Brain, Layers, Compass, Filter, SlidersHorizontal, EyeOff, Lock, Unlock, Gift, Crown, Award, BadgeCheck, Newspaper, BookOpen, PenLine, List, Settings, ArrowUpDown, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react'
import toast from 'react-hot-toast'

// typescript types...
export interface PostSummaryMeta {
  content: string
  hashtags?: string[]
  mentions?: string[]
  mediaCount?: number
  likes?: number
  reposts?: number
  comments?: number
  views?: number
  bookmarks?: number
  postedAt?: string
  taggedLocation?: { text: string; coordinates: number[] }[]
  poll?: { question: string; options: { text: string; votes: number }[] }
  sentiment?: 'positive' | 'neutral' | 'negative'
  category?: string
  keywords?: string[]
}

export interface ProfileSummaryMeta {
  name: string
  handle: string
  bio: string
  followers?: string
  following?: string
  posts?: string
  joinDate?: string
  location?: string
  website?: string
  isVerified?: boolean
  plan?: string
  interests?: string[]
  contentCategories?: string[]
  avgEngagement?: string
}

interface AISummaryProps {
  type: 'post' | 'profile'
  meta: PostSummaryMeta | ProfileSummaryMeta
  onClose: () => void
}

function getSentimentIcon(sentiment?: string) {
  switch (sentiment) {
    case 'positive':
      return <Smile className="w-5 h-5 text-green-500" />
    case 'negative':
      return <Frown className="w-5 h-5 text-red-500" />
    default:
      return <Meh className="w-5 h-5 text-yellow-500" />
  }
}

function getSentimentLabel(sentiment?: string) {
  switch (sentiment) {
    case 'positive':
      return 'Positive'
    case 'negative':
      return 'Negative'
    default:
      return 'Neutral'
  }
}

function getSentimentColor(sentiment?: string) {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
    case 'negative':
      return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
    default:
      return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
  }
}


function StatBadge({ icon , label , value }: { icon: React.ReactNode ; label: string ; value?: string | number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-yellow-200 dark:hover:border-yellow-800 transition-all duration-200">
      <span className="text-yellow-500 shrink-0">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {value ?? '—'}
        </span>
      </div>
    </div>
  )
}

function InsightCard({ icon , title , description , action }: {
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-black p-4 hover:shadow-md hover:border-yellow-200 dark:hover:border-yellow-900 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-400/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors cursor-pointer"
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


function TagPill({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-colors cursor-default">
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </span>
  )
}

export default function AISummary({ type , meta , onClose }: AISummaryProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on Escape key...
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])


  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    toast.success('Summary copied to clipboard')
  }


  const handleRegenerate = () => {
    
    toast.success('Regenerating summary...')
  }

  // ── Post Summary Content ──────────────────────────────────────────
  const renderPostSummary = () => {
    const p = meta as PostSummaryMeta
    const wordCount = p.content?.split(/\s+/).filter(Boolean).length ?? 0
    const charCount = p.content?.length ?? 0
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

    return (
      <div className="space-y-5">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatBadge icon={<Eye className="w-4 h-4" />} label="Views" value={p.views?.toLocaleString()} />
          <StatBadge icon={<Heart className="w-4 h-4" />} label="Likes" value={p.likes?.toLocaleString()} />
          <StatBadge icon={<Repeat2 className="w-4 h-4" />} label="Reposts" value={p.reposts?.toLocaleString()} />
          <StatBadge icon={<MessageCircle className="w-4 h-4" />} label="Comments" value={p.comments?.toLocaleString()} />
          <StatBadge icon={<Bookmark className="w-4 h-4" />} label="Bookmarks" value={p.bookmarks?.toLocaleString()} />
          <StatBadge icon={<Calendar className="w-4 h-4" />} label="Posted" value={p.postedAt} />
        </div>

        {/* Sentiment & Category */}
        <div className="flex flex-wrap gap-2">
          {p.sentiment && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getSentimentColor(p.sentiment)}`}>
              {getSentimentIcon(p.sentiment)}
              <span>{getSentimentLabel(p.sentiment)} Sentiment</span>
            </div>
          )}
          {p.category && (
            <TagPill label={p.category} icon={<Target className="w-3 h-3" />} />
          )}
          {p.keywords?.slice(0, 3).map((kw) => (
            <TagPill key={kw} label={kw} />
          ))}
        </div>

        {/* Content Summary */}
        <div className="rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/10 dark:to-amber-950/10 border border-yellow-100 dark:border-yellow-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Content Analysis</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {p.content?.length > 200 && !expanded
              ? p.content.slice(0, 200) + '...'
              : p.content}
          </p>
          {p.content?.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors cursor-pointer"
            >
              {expanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} characters</span>
            <span>·</span>
            <span>{estimatedReadTime} min read</span>
          </div>
        </div>

        {/* Hashtags & Mentions */}
        <div className="space-y-3">
          {p.hashtags && p.hashtags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Hashtags ({p.hashtags.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.hashtags.map((tag) => (
                  <TagPill key={tag} label={`#${tag}`} icon={<Hash className="w-3 h-3" />} />
                ))}
              </div>
            </div>
          )}
          {p.mentions && p.mentions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AtSign className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Mentions ({p.mentions.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.mentions.map((mention) => (
                  <TagPill key={mention} label={`@${mention}`} icon={<AtSign className="w-3 h-3" />} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {p.taggedLocation && p.taggedLocation.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <MapPin className="w-4 h-4 text-yellow-500 shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Tagged at: {p.taggedLocation.map((l) => l.text).join(', ')}
            </span>
          </div>
        )}

        {/* Poll Summary */}
        {p.poll && (
          <div className="rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 border border-purple-100 dark:border-purple-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Poll Insights</h4>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              {p.poll.question}
            </p>
            <div className="space-y-1.5">
              {p.poll.options.map((opt) => (
                <div key={opt.text} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{opt.text}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{opt.votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Insights</h4>
          </div>
          <div className="grid gap-3">
            <InsightCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Engagement Potential"
              description="This post has strong engagement signals. The content style resonates well with the audience based on current interaction metrics."
            />
            <InsightCard
              icon={<Target className="w-5 h-5" />}
              title="Suggested Improvements"
              description="Adding more visual media could increase reach by up to 40%. Consider including a call-to-action to boost comments."
            />
            <InsightCard
              icon={<Zap className="w-5 h-5" />}
              title="Best Posting Time"
              description="Posts with similar content perform best during evening hours (6-9 PM). Consider scheduling future posts accordingly."
            />
          </div>
        </div>

        {/* Media Summary */}
        {p.mediaCount !== undefined && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              {p.mediaCount > 0 ? (
                <>
                  <Image className="w-4 h-4 text-yellow-500" />
                  <span>{p.mediaCount} media item{p.mediaCount > 1 ? 's' : ''} attached</span>
                </>
              ) : (
                <>
                  <File className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">No media attached</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Profile Summary Content ────────────────────────────────────────
  const renderProfileSummary = () => {
    const p = meta as ProfileSummaryMeta
    const followerNum = parseInt(String(p.followers ?? '0').replace(/[^0-9]/g, '')) || 0
    const followingNum = parseInt(String(p.following ?? '0').replace(/[^0-9]/g, '')) || 0
    const postsNum = parseInt(String(p.posts ?? '0').replace(/[^0-9]/g, '')) || 0
    const followerToFollowingRatio = followingNum > 0 ? (followerNum / followingNum).toFixed(1) : '—'

    return (
      <div className="space-y-5">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatBadge icon={<Users className="w-4 h-4" />} label="Followers" value={p.followers} />
          <StatBadge icon={<UserCheck className="w-4 h-4" />} label="Following" value={p.following} />
          <StatBadge icon={<FileText className="w-4 h-4" />} label="Posts" value={p.posts} />
          <StatBadge icon={<Activity className="w-4 h-4" />} label="F/FO Ratio" value={followerToFollowingRatio} />
          <StatBadge icon={<Calendar className="w-4 h-4" />} label="Joined" value={p.joinDate} />
          <StatBadge icon={<Globe className="w-4 h-4" />} label="Location" value={p.location || '—'} />
        </div>

        {/* Verification & Plan */}
        <div className="flex flex-wrap gap-2">
          {p.isVerified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Verified {p.plan}</span>
            </div>
          )}
          {p.plan && !p.isVerified && (
            <TagPill label={`${p.plan} Plan`} icon={<Crown className="w-3 h-3" />} />
          )}
          <TagPill label={`${postsNum} total posts`} icon={<FileText className="w-3 h-3" />} />
        </div>

        {/* Bio Analysis */}
        <div className="rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/10 dark:to-amber-950/10 border border-yellow-100 dark:border-yellow-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Bio Analysis</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
            &ldquo;{p.bio}&rdquo;
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-gray-400 dark:text-gray-500">
            <span>{p.bio?.split(/\s+/).filter(Boolean).length ?? 0} words</span>
            <span>·</span>
            <span>Bio completeness: {((p.bio?.length ?? 0) / 160 * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Interests & Content Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {p.interests && p.interests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Interests</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.interests.map((interest) => (
                  <TagPill key={interest} label={interest} />
                ))}
              </div>
            </div>
          )}
          {p.contentCategories && p.contentCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Content Style</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.contentCategories.map((cat) => (
                  <TagPill key={cat} label={cat} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Profile Insights</h4>
          </div>
          <div className="grid gap-3">
            <InsightCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Audience Growth"
              description={`Follower-to-following ratio of ${followerToFollowingRatio} indicates ${followerNum > followingNum ? 'strong organic reach and content authority in your niche.' : 'room for growth in content distribution strategy.'}`}
            />
            <InsightCard
              icon={<Compass className="w-5 h-5" />}
              title="Content Strategy"
              description={p.contentCategories?.length
                ? `Your content spans ${p.contentCategories.length} categories. Diversifying within these topics could attract 2x more engagement.`
                : 'Establishing consistent content categories can help build a stronger personal brand.'}
            />
            <InsightCard
              icon={<Target className="w-5 h-5" />}
              title="Recommendation"
              description={p.avgEngagement
                ? `Your average engagement rate of ${p.avgEngagement} is solid. Focus on community interaction to push it higher.`
                : 'Engage more with your audience through polls, Q&A sessions, and consistent posting to boost interaction.'}
              action={{ label: 'View detailed analytics', onClick: () => toast.success('Analytics feature coming soon!') }}
            />
          </div>
        </div>

        {/* Website & Social */}
        {p.website && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <Link2 className="w-4 h-4 text-yellow-500 shrink-0" />
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              {p.website}
            </a>
            <ExternalLink className="w-3 h-3 text-gray-400 shrink-0 ml-auto" />
          </div>
        )}
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto p-2 sm:p-4"
        onClick={(e: React.MouseEvent) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-gray-800"
        >
          {/* ── Header ─────────────────────────────── */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 rounded-t-2xl px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                    AI Summary
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                      <Zap className="w-2.5 h-2.5" />
                      {type === 'post' ? 'Post' : 'Profile'}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {type === 'post'
                      ? 'AI-generated insights and analysis for this post'
                      : 'AI-powered profile overview and recommendations'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleRegenerate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
              <button
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showFullAnalysis
                    ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showFullAnalysis ? 'Basic' : 'Full'}
              </button>
            </div>
          </div>

          {/* body */}
          <div className="px-5 py-5">
            {type === 'post' ? renderPostSummary() : renderProfileSummary()}
          </div>

          {/* footer */}
          <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 rounded-b-2xl px-5 py-4">
              {/* Powered by */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                <img src="https://latestlogo.com/wp-content/uploads/2024/01/openai-icon.png" className="w-5 h-5" alt='open-ai' />
                <div className='flex flex-col items-center gap-1'>
                  <span>Powered by OpenAI</span>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">chatGPT</span>
                </div>
              </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

