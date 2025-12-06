"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

import { Textarea } from '@/components/ui/textarea';
import { Star, Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast-context';

interface Review {
    id: string;
    eventId: string;
    eventTitle: string;
    eventTitleAr: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
    replies?: number;
}

export default function ReviewsRatings() {
    const { language } = useLanguage();
    const { myTickets, events } = usePersona();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: '1',
            eventId: '1',
            eventTitle: 'Saudi Cardiology Conference 2025',
            eventTitleAr: '   2025',
            rating: 5,
            comment: language === 'ar' 
                ? '       '
                : 'Excellent conference with high-quality content and outstanding speakers',
            date: '2025-03-20',
            helpful: 12,
            replies: 3,
        },
    ]);
    const [newReview, setNewReview] = useState({ eventId: '', rating: 0, comment: '' });
    const [showForm, setShowForm] = useState(false);

    const registeredEvents = events.filter(e => myTickets.includes(e.id));
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const handleSubmitReview = async () => {
        if (!newReview.eventId || !newReview.rating || !newReview.comment) {
            showToast(language === 'ar' ? '   ' : 'Please fill all fields', 'info');
            return;
        }

        const event = events.find(e => e.id === newReview.eventId);
        if (!event) {
            showToast(language === 'ar' ? '  ' : 'Event not found', 'info');
            return;
        }

        try {
            const res = await api.createReview({
                eventId: newReview.eventId,
                hcpId: 'hcp-1',
                rating: newReview.rating,
                text: newReview.comment
            });

            if (res.ok) {
                const review: Review = {
                    id: res.reviewId,
                    eventId: newReview.eventId,
                    eventTitle: event.titleEn,
                    eventTitleAr: event.titleAr,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    date: new Date().toISOString(),
                    helpful: 0,
                };

                setReviews([review, ...reviews]);
                setNewReview({ eventId: '', rating: 0, comment: '' });
                setShowForm(false);
                showToast(language === 'ar' ? '   ' : 'Review submitted successfully', 'success');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === 'ar' ? ' ' : 'An error occurred');
            showToast(message, 'info');
        }
    };

    const title = language === 'ar' ? ' ' : 'Reviews & Ratings';
    const averageRatingText = language === 'ar' ? ' ' : 'Average Rating';
    const totalReviewsText = language === 'ar' ? ' ' : 'Total Reviews';
    const writeReviewText = language === 'ar' ? ' ' : 'Write Review';
    const selectEventText = language === 'ar' ? ' ' : 'Select Event';
    const yourRatingText = language === 'ar' ? '' : 'Your Rating';
    const yourCommentText = language === 'ar' ? '' : 'Your Comment';
    const submitText = language === 'ar' ? '' : 'Submit';
    const cancelText = language === 'ar' ? '' : 'Cancel';
    const helpfulText = language === 'ar' ? '' : 'Helpful';
    const noReviewsText = language === 'ar' ? '   ' : 'No reviews yet';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                <GlassButton
                    variant="default"
                    onClick={() => setShowForm(!showForm)}
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {writeReviewText}
                </GlassButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{averageRatingText}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-[var(--label)]">{averageRating.toFixed(1)}</p>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${
                                                star <= Math.round(averageRating)
                                                    ? 'text-[var(--apple-yellow)] fill-[var(--apple-yellow)]'
                                                    : 'text-[var(--tertiary-label)]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-yellow)]/10">
                            <Star className="w-8 h-8 text-[var(--apple-yellow)] fill-[var(--apple-yellow)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalReviewsText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{reviews.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <MessageSquare className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {showForm && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{writeReviewText}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {selectEventText}
                            </label>
                            <select
                                value={newReview.eventId}
                                onChange={(e) => setNewReview({ ...newReview, eventId: e.target.value })}
                                className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                            >
                                <option value="">{selectEventText}</option>
                                {registeredEvents.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {language === 'ar' ? event.titleAr : event.titleEn}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {yourRatingText}
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${
                                                star <= newReview.rating
                                                    ? 'text-[var(--apple-yellow)] fill-[var(--apple-yellow)]'
                                                    : 'text-[var(--tertiary-label)]'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {yourCommentText}
                            </label>
                            <Textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder={language === 'ar' ? '  ...' : 'Write your review here...'}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex gap-2">
                            <GlassButton
                                variant="default"
                                onClick={handleSubmitReview}
                                disabled={!newReview.eventId || !newReview.rating || !newReview.comment}
                                className="flex-1 items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {submitText}
                            </GlassButton>
                            <GlassButton
                                variant="outline"
                                onClick={() => {
                                    setShowForm(false);
                                    setNewReview({ eventId: '', rating: 0, comment: '' });
                                }}
                            >
                                {cancelText}
                            </GlassButton>
                        </div>
                    </div>
                </LiquidGlassCard>
            )}

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-label)]" />
                            <p className="text-[var(--secondary-label)]">{noReviewsText}</p>
                        </div>
                    </LiquidGlassCard>
                ) : (
                    reviews.map((review) => (
                        <LiquidGlassCard key={review.id} blurIntensity="lg" interactive={false} className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                            {language === 'ar' ? review.eventTitleAr : review.eventTitle}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= review.rating
                                                                ? 'text-[var(--apple-yellow)] fill-[var(--apple-yellow)]'
                                                                : 'text-[var(--tertiary-label)]'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-[var(--tertiary-label)]">
                                                {new Date(review.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[var(--label)]">{review.comment}</p>

                                <div className="flex items-center gap-4 pt-2 border-t border-[var(--separator)]">
                                    <button className="flex items-center gap-2 text-sm text-[var(--secondary-label)] hover:text-[var(--label)] transition-colors inline-flex items-center justify-center">
                                        <ThumbsUp className="w-4 h-4" />
                                        {helpfulText} ({review.helpful})
                                    </button>
                                    {review.replies && (
                                        <span className="text-sm text-[var(--secondary-label)]">
                                            {review.replies} {language === 'ar' ? '' : 'replies'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </LiquidGlassCard>
                    ))
                )}
            </div>
        </div>
    );
}

