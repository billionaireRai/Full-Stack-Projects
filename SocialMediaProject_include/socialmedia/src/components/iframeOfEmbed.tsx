'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Code2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Heart,
  Repeat,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import toast from 'react-hot-toast';

interface mediaType {
  url: string;
  media_type: string;
}

interface locationTaggedType {
  text: string;
  coordinates: number[];
}

interface pollInfoType {
  question: string;
  options: { text: string; votes: number }[];
  duration: number;
  expiry: Date;
}

interface IframeOfEmbedProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  avatar?: string;
  username?: string;
  handle?: string;
  timestamp?: string;
  content?: string;
  media?: mediaType[];
  likes?: number;
  reposts?: number;
  replies?: number;
  views?: number;
  hashTags?: string[];
  mentions?: string[];
  isVerified?: boolean;
  // Public endpoint URL - user will provide this
  publicEndpoint?: string;
}

export default function IframeOfEmbed({
  isOpen,
  onClose,
  postId,
  avatar = '/images/myProfile.jpg',
  username = 'User',
  handle = 'user',
  timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toLocaleLowerCase(),
  content = '',
  media = [],
  likes = 0,
  reposts = 0,
  replies = 0,
  views = 0,
  hashTags = [],
  mentions = [],
  isVerified = false,
  publicEndpoint = 'default'
}: IframeOfEmbedProps) {
  const [copied, setCopied] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  
  // Size and display controls
  const [iframeWidth, setIframeWidth] = useState(600);
  const [iframeHeight, setIframeHeight] = useState(400);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'full'>('center');
  const [isResponsive, setIsResponsive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default values
  const displayMedia = media || [];
  const displayHashtags = hashTags || [];
  const displayMentions = mentions || [];

  // Size presets
  const sizePresets = [
    { label: 'Small', width: 400, height: 300 },
    { label: 'Medium', width: 600, height: 400 },
    { label: 'Large', width: 800, height: 500 },
  ];

  // Generate iframe code based on settings
  const generateIframeCode = () => {
    if (isResponsive) {
      return `<iframe 
  src="${publicEndpoint}"
  style="width: 100%;"
  height="${iframeHeight}"
  >
  </iframe>`;
    }
    return `<iframe 
  src="${publicEndpoint}"
  width="${iframeWidth}"
  height="${iframeHeight}"
  >
  </iframe>`;
  };

  const iframeCode = generateIframeCode();

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Reset loading state when endpoint changes
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
  };

  // Generate share URL
  const shareUrl = `http://localhost:3000/${handle}/post/${postId}`;

  // Function to parse content and make hashtags and mentions clickable
  const parseHashAndMentions = () => {
    const combinedArray: React.ReactNode[] = [];
    
    displayHashtags.forEach((eachHash) => {
      combinedArray.push(
        <Link
          key={`hash-${eachHash}`}
          href={`/explore?q=${encodeURIComponent('#'.concat(eachHash))}&utm_source=post-click`}
          className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors cursor-pointer mr-2"
        >
          #{eachHash}
        </Link>
      );
    });

    displayMentions.forEach((eachMention) => {
      combinedArray.push(
        <Link
          key={`mention-${eachMention}`}
          href={`/@${eachMention}`}
          className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors cursor-pointer mr-2"
        >
          @{eachMention}
        </Link>
      );
    });

    return combinedArray;
  };

  // Copy to clipboard handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  // Copy iframe code handler
  const handleCopyIframe = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopiedIframe(true);
      toast.success('Iframe code copied to clipboard!');
      setTimeout(() => setCopiedIframe(false), 2000);
    } catch (err) {
      toast.error('Failed to copy iframe code');
    }
  };

  // Handle clicking outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-black rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative flex flex-col shadow-2xl border border-gray-200 dark:border-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 m-2 border-b rounded-lg border-gray-200 dark:border-gray-900">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-gray-900 dark:text-white" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Embed Post</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Post Preview */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <Link href={`/${handle}`}>
                <img
                  src={avatar}
                  alt={`${username}'s avatar`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600 cursor-pointer"
                />
              </Link>

              {/* Post Body */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                    {username}
                  </span>
                  {isVerified && (
                    <span>
                      <Image src='/images/yellow-tick.png' width={16} height={16} alt='verified' className="w-4 h-4" />
                    </span>
                  )}
                  <Link 
                    href={`/${handle}`}
                    className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate"
                  >
                    {handle}
                  </Link>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">
                    {timestamp}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-1 text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                  <div>{content}</div>
                  <div className="mt-1">{parseHashAndMentions()}</div>
                </div>

                {/* Media Preview */}
                {displayMedia && displayMedia.length > 0 && displayMedia.some(item => item.url && item.url.trim() !== '') && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {displayMedia.filter(item => item.url && item.url.trim() !== '').length === 1 ? (
                      displayMedia[0].media_type === 'video' ? (
                        <video
                          src={displayMedia[0].url}
                          controls
                          className="w-full max-h-48 object-cover"
                        />
                      ) : (
                        <img
                          src={displayMedia[0].url}
                          alt="Post media"
                          className="w-full max-h-48 object-cover"
                        />
                      )
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {displayMedia.slice(0, 4).map((item, index) => (
                          item.media_type === 'video' ? (
                            <video
                              key={index}
                              src={item.url}
                              controls
                              className="w-full h-24 object-cover"
                            />
                          ) : (
                            <img
                              key={index}
                              src={item.url}
                              alt={`Post media ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                          )
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Preview */}
                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{replies}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                    <Repeat className="w-4 h-4" />
                    <span>{reposts}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embed Options */}
          <div className="space-y-4">
            {/* Link Section */}
            <div className="p-4 bg-gray-50 dark:bg-black rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Post Link</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleCopyLink}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? 'Copied!' : 'Copy link'}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-950 text-gray-900 dark:text-white rounded-lg cursor-pointer transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open post
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Iframe Section */}
            <div className="p-4 bg-gray-50 dark:bg-black rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Iframe Embed Code</h3>
              <pre className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white font-mono overflow-x-auto">
                <code>{iframeCode}</code>
              </pre>
              <div className="mt-2 flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleCopyIframe}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium"
                    >
                      {copiedIframe ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                      {copiedIframe ? 'Copied!' : 'Copy Code'}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copiedIframe ? 'Copied!' : 'Copy iframe code'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Preview Section */}
            {publicEndpoint && (
              <div className="p-4 bg-gray-50 dark:bg-black rounded-xl">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Embed Preview</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg h-fit cursor-none">
                <iframe
                  src={publicEndpoint}
                  width="100%"
                  height="400"
                  title="Embed Preview"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
                </div>
                <div className="mt-2 flex justify-end">
                  <Link 
                    href={publicEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                  >
                    Open in new tab <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 m-2 border-t rounded-lg border-gray-200 dark:border-gray-950 bg-gray-50 dark:bg-black">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Copy the link or iframe code to embed this post on your website
          </p>
        </div>
      </div>
    </div>
  );
}
