// Database schema for a media application integrating with Spotify...
[
     { // userStructure
      userId: "String, unique identifier",
      username: "String, unique",
      email: "String, unique",
      passwordHash: "String",
      profilePicture: "String, URL to image",
      createdAt: "Date",
      updatedAt: "Date",
      spotifyUser_Id: "String, unique identifier from Spotify",
      preferences: {
        favoriteGenres: ["String"], // Array of favorite genres
        language: "String" // User's preferred language
      }
    },
    {  // mediastructure
      mediaId: "String, unique identifier",
      title: "String",
      description: "String",
      mediaType: "String: e.g., 'audio', 'video', 'image'",
      url: "String, URL to media file",
      thumbnailUrl: "String, URL to thumbnail",
      duration: "Number, in seconds, for audio/video",
      createdAt: "Date",
      updatedAt: "Date",
      userId: "String, reference to the Users collection",
      externalId: "String, unique identifier from Spotify (e.g., trackId)",
      tags: ["String"], // Array of tags for categorization
      playCount: "Number" // Number of times the media has been played
    },
   {  // playlistStructure
      playlistId: "String, unique identifier",
      title: "String",
      description: "String",
      userId: "String, reference to the Users collection",
      mediaIds: ["String, references to Media collection"],
      createdAt: "Date",
      updatedAt: "Date",
      isPublic: "Boolean", // Indicates if the playlist is public or private
      collaborative: "Boolean" // Indicates if other users can add to the playlist
    },
    { // commentStructure
      commentId: "String, unique identifier",
      mediaId: "String, reference to Media collection",
      userId: "String, reference to Users collection",
      content: "String",
      createdAt: "Date",
      updatedAt: "Date",
      likesCount: "Number" // Number of likes on this comment
    },
    { // likeStructure
      likeId: "String, unique identifier",
      mediaId: "String, reference to Media collection",
      userId: "String, reference to Users collection",
      createdAt: "Date",
      updatedAt: "Date",
      isRemoved: "Boolean" // Indicates if the like has been removed
    },
    {  // usersettingStructure
      userId: "String, reference to Users collection",
      notificationPreferences: {
        emailNotifications: "Boolean",
        pushNotifications: "Boolean"
      },
      theme: "String", // e.g., "light", "dark"
      language: "String" // Preferred language for the app
    },
    { // historyStructure
      historyId: "String, unique identifier",
      userId: "String, reference to Users collection",
      mediaId: "String, reference to Media collection",
      timestamp: "Date", // When the media was accessed
      action: "String" // e.g., "played", "liked", "added to playlist"
    },
    { // favouriteStructure
      favoriteId: "String, unique identifier",
      userId: "String, reference to Users collection",
      mediaId: "String, reference to Media collection",
      createdAt: "Date"
    },
    { // shareStructure
      shareId: "String, unique identifier",
      mediaId: "String, reference to Media collection",
      playlistId: "String, reference to Playlists collection (optional)",
      userId: "String, reference to Users collection",
      sharedWith: ["String"], // Array of userIds or email addresses
      createdAt: "Date"
    },
  
]