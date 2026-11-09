/**
 * Centralized feature and visibility resolution utility for InviteQue wedding templates.
 * 
 * Rules:
 * 1. RSVP entitlement (hasRsvp):
 *    - In builder/preview mode: always allowed so the customer can design/preview RSVP.
 *    - On live public links: strictly gated by whether RSVP was purchased (hasRsvp === true || isRsvpPaid === true).
 * 2. RSVP section display (showRsvp):
 *    - Can only be visible if entitled (hasRsvp is true).
 *    - Respects customer's toggle preference (showRsvp / enabled).
 * 3. Wedding Schedule section display (showSchedule):
 *    - Completely independent of RSVP.
 *    - Controlled by showWeddingSchedule / showSchedule toggle in Builder Step 3.
 *    - Turning off schedule section NEVER hides or deletes events from RSVP.
 * 4. Photo Gallery / Photo Cards display (showGallery):
 *    - Controlled by showGallery toggle in Builder Step 3.
 *    - When disabled, photo cards / gallery section is completely hidden.
 * 5. Venue, Welcome & Countdown display:
 *    - Controlled by respective builder toggles.
 */

export function resolveInvitationFeatures({
  savedData = null,
  draftData = null,
  isCustomPreview = false,
  isPreview = false,
  customEvents = null,
} = {}) {
  const isPreviewMode = Boolean(
    isCustomPreview ||
    isPreview ||
    (typeof window !== 'undefined' && (
      new URLSearchParams(window.location.search).get('preview') === 'true' ||
      new URLSearchParams(window.location.search).get('customPreview') === 'true'
    ))
  );

  const hasDraftContent = draftData && typeof draftData === 'object' && Object.keys(draftData).length > 0;
  const activeData = savedData || (isCustomPreview && hasDraftContent ? draftData : null);
  const isGalleryView = !activeData; // direct catalog demo preview without user customizations

  // 1. Payment status & RSVP Entitlement
  const isPaid = Boolean(
    savedData && (
      String(savedData.status).toUpperCase() === 'PAID' ||
      savedData.isPaid === true ||
      (savedData.coupleData && savedData.coupleData.isPaid === true)
    )
  );

  const hasRsvp = Boolean(
    savedData
      ? (
          savedData.hasRsvp ||
          savedData.isRsvpPaid ||
          savedData.rsvpData?.isPaid ||
          savedData.invitationData?.hasRsvp ||
          savedData.invitationData?.isRsvpPaid ||
          (isPaid && Number(savedData.amountPaid) >= 2999 && (savedData.rsvpData?.enabled || savedData.hasRsvp || savedData.invitationData?.hasRsvp))
        )
      : (draftData?.hasRsvp ?? false)
  );

  // In builder preview, customer is designing their RSVP, so allow previewing. On live link, strictly require entitlement.
  const isRsvpEntitled = isPreviewMode ? true : hasRsvp;

  // RSVP user toggle preference
  const wantsRsvp = savedData
    ? (
        savedData.invitationData?.hasRsvp !== undefined
          ? Boolean(savedData.invitationData.hasRsvp)
          : Boolean(savedData.rsvpData?.enabled ?? savedData.hasRsvp)
      )
    : Boolean(draftData?.hasRsvp ?? true);

  const showRsvp = isGalleryView
    ? true
    : (isRsvpEntitled && wantsRsvp && !(activeData?.hideRsvp || savedData?.hideRsvp || customEvents));

  // 2. Photo Gallery / Photo Cards visibility (checks showGallery, invitationData.showGallery, scheduleData.showGallery)
  const isGalleryEnabled = savedData
    ? (
        savedData.invitationData?.showGallery !== undefined
          ? Boolean(savedData.invitationData.showGallery)
          : savedData.scheduleData?.showGallery !== undefined
            ? Boolean(savedData.scheduleData.showGallery)
            : savedData.showGallery !== undefined
              ? Boolean(savedData.showGallery)
              : true
      )
    : (draftData?.showGallery !== undefined ? Boolean(draftData.showGallery) : true);

  const showGallery = isGalleryView
    ? true
    : (isGalleryEnabled && !(activeData?.hidePhotoCards || savedData?.hidePhotoCards || activeData?.hideGallery || savedData?.hideGallery));

  // 3. Wedding Schedule visibility (independent of RSVP)
  const isScheduleEnabled = savedData
    ? (
        savedData.invitationData?.showSchedule !== undefined
          ? Boolean(savedData.invitationData.showSchedule)
          : savedData.scheduleData?.showSchedule !== undefined
            ? Boolean(savedData.scheduleData.showSchedule)
            : savedData.invitationData?.showWeddingSchedule !== undefined
              ? Boolean(savedData.invitationData.showWeddingSchedule)
              : savedData.scheduleData?.showWeddingSchedule !== undefined
                ? Boolean(savedData.scheduleData.showWeddingSchedule)
                : savedData.showSchedule !== undefined
                  ? Boolean(savedData.showSchedule)
                  : true
      )
    : (draftData?.showSchedule !== undefined ? Boolean(draftData.showSchedule) : true);

  const showSchedule = isGalleryView
    ? true
    : (isScheduleEnabled && !(activeData?.hideSchedule || savedData?.hideSchedule || customEvents));

  // 4. Venue visibility
  const isVenueEnabled = savedData
    ? (
        savedData.invitationData?.showVenue !== undefined
          ? Boolean(savedData.invitationData.showVenue)
          : savedData.venueData?.showVenue !== undefined
            ? Boolean(savedData.venueData.showVenue)
            : savedData.showVenue !== undefined
              ? Boolean(savedData.showVenue)
              : true
      )
    : (draftData?.showVenue !== undefined ? Boolean(draftData.showVenue) : true);

  const showVenue = isGalleryView
    ? true
    : (isVenueEnabled && !(activeData?.hideVenue || savedData?.hideVenue || customEvents));

  // 5. Welcome note visibility
  const isWelcomeEnabled = savedData
    ? (
        savedData.invitationData?.showWelcome !== undefined
          ? Boolean(savedData.invitationData.showWelcome)
          : savedData.showWelcome !== undefined
            ? Boolean(savedData.showWelcome)
            : true
      )
    : (draftData?.showWelcome !== undefined ? Boolean(draftData.showWelcome) : true);

  const showWelcome = isGalleryView
    ? true
    : (isWelcomeEnabled && !(activeData?.hideWelcome || savedData?.hideWelcome));

  // 6. Countdown timer visibility
  const isCountdownEnabled = savedData
    ? (
        savedData.invitationData?.showCountdown !== undefined
          ? Boolean(savedData.invitationData.showCountdown)
          : savedData.showCountdown !== undefined
            ? Boolean(savedData.showCountdown)
            : true
      )
    : (draftData?.showCountdown !== undefined ? Boolean(draftData.showCountdown) : true);

  const showCountdown = isGalleryView
    ? true
    : (isCountdownEnabled && !(activeData?.hideCountdown || savedData?.hideCountdown));

  // 7. Watermark visibility (active in any preview or when invite has not been paid)
  const showWatermark = savedData?.showWatermark === false
    ? false
    : (isPreviewMode || !isPaid);

  // 8. Synchronized Events
  const rawEvents =
    savedData?.scheduleData?.items ||
    savedData?.eventSchedule ||
    draftData?.scheduleItems ||
    draftData?.eventSchedule ||
    [];
  const events = Array.isArray(rawEvents) && rawEvents.length > 0 ? rawEvents : null;

  // 9. Photos
  const rawPhotos =
    savedData?.storyData?.photos ||
    savedData?.photos ||
    draftData?.photos ||
    [];
  const photos = Array.isArray(rawPhotos) ? rawPhotos : [];

  return {
    isPaid,
    showWatermark,
    hasRsvp,
    isRsvpEntitled,
    showRsvp,
    showGallery,
    showPhotoCards: showGallery, // Alias for photo cards
    showSchedule,
    showVenue,
    showWelcome,
    showCountdown,
    showFamilySection: Boolean(activeData?.showFamilySection || savedData?.invitationData?.showFamilySection),
    showCustomSection: Boolean(activeData?.showCustomSection || savedData?.invitationData?.showCustomSection),
    events,
    photos,
    isPreviewMode,
    activeData,
  };
}
