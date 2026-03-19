import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Category = {
    #confidence;
    #gratitude;
    #health;
    #love;
    #success;
    #mindfulness;
  };

  public type Affirmation = {
    id : Nat;
    text : Text;
    category : Category;
    isCustom : Bool;
    authorPrincipal : Principal;
    createdAt : Time.Time;
  };

  public type AffirmationWithFavorite = {
    affirmation : Affirmation;
    isFavorite : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module AffirmationWithFavorite {
    public func compare(a1 : AffirmationWithFavorite, a2 : AffirmationWithFavorite) : Order.Order {
      let a1Time = a1.affirmation.createdAt;
      let a2Time = a2.affirmation.createdAt;
      if (a1Time < a2Time) { #less } else if (a1Time > a2Time) { #greater } else {
        Nat.compare(a1.affirmation.id, a2.affirmation.id);
      };
    };
  };

  let affirmations = Map.empty<Nat, Affirmation>();
  let userFavorites = Map.empty<Principal, List.List<Nat>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SeedEntry = { text : Text; category : Category };

  let seedData : [SeedEntry] = [
    // Confidence (25)
    { text = "I am powerful beyond fear"; category = #confidence },
    { text = "I am not limited by doubt"; category = #confidence },
    { text = "I am the creator of my reality"; category = #confidence },
    { text = "My inner strength is infinite"; category = #confidence },
    { text = "I stand firm like the eternal Self"; category = #confidence },
    { text = "Nothing external defines me"; category = #confidence },
    { text = "I act with clarity and courage"; category = #confidence },
    { text = "I trust my inner intelligence"; category = #confidence },
    { text = "I am fearless in action"; category = #confidence },
    { text = "My presence commands respect"; category = #confidence },
    { text = "I am grounded in truth"; category = #confidence },
    { text = "I rise above uncertainty"; category = #confidence },
    { text = "My mind is steady and sharp"; category = #confidence },
    { text = "I carry divine strength within me"; category = #confidence },
    { text = "I am unshakable in my purpose"; category = #confidence },
    { text = "I move forward with certainty"; category = #confidence },
    { text = "I am aligned with universal power"; category = #confidence },
    { text = "I act without hesitation"; category = #confidence },
    { text = "I am confident in every step"; category = #confidence },
    { text = "My willpower is strong"; category = #confidence },
    { text = "I overcome every challenge"; category = #confidence },
    { text = "I trust myself completely"; category = #confidence },
    { text = "I am bold and decisive"; category = #confidence },
    { text = "I radiate confidence naturally"; category = #confidence },
    { text = "I am enough as I am"; category = #confidence },
    // Gratitude (25)
    { text = "I am grateful for the breath of life"; category = #gratitude },
    { text = "I honor everything I receive"; category = #gratitude },
    { text = "I welcome abundance with humility"; category = #gratitude },
    { text = "I appreciate every moment"; category = #gratitude },
    { text = "I give thanks for seen and unseen blessings"; category = #gratitude },
    { text = "I am grateful for my journey"; category = #gratitude },
    { text = "I respect all forms of life"; category = #gratitude },
    { text = "I receive with an open heart"; category = #gratitude },
    { text = "I acknowledge the universe's support"; category = #gratitude },
    { text = "I am thankful for growth and challenges"; category = #gratitude },
    { text = "I live in appreciation"; category = #gratitude },
    { text = "I honor my past and present"; category = #gratitude },
    { text = "I feel abundance within me"; category = #gratitude },
    { text = "Gratitude flows through me"; category = #gratitude },
    { text = "I cherish every experience"; category = #gratitude },
    { text = "I am thankful for my strength"; category = #gratitude },
    { text = "I respect divine timing"; category = #gratitude },
    { text = "I accept life with gratitude"; category = #gratitude },
    { text = "I am blessed in countless ways"; category = #gratitude },
    { text = "I recognize the good in everything"; category = #gratitude },
    { text = "I am grateful for awareness"; category = #gratitude },
    { text = "I live with reverence"; category = #gratitude },
    { text = "I thank the universe daily"; category = #gratitude },
    { text = "I feel deeply fulfilled"; category = #gratitude },
    { text = "Gratitude is my natural state"; category = #gratitude },
    // Health (25)
    { text = "My body is strong and balanced"; category = #health },
    { text = "I am filled with life energy (prana)"; category = #health },
    { text = "Every cell in my body is healthy"; category = #health },
    { text = "I radiate vitality"; category = #health },
    { text = "My mind and body are in harmony"; category = #health },
    { text = "I heal naturally and completely"; category = #health },
    { text = "I am aligned with nature's rhythm"; category = #health },
    { text = "My body regenerates perfectly"; category = #health },
    { text = "I am full of strength and energy"; category = #health },
    { text = "My breath nourishes my being"; category = #health },
    { text = "I am calm and relaxed"; category = #health },
    { text = "My immune system is powerful"; category = #health },
    { text = "I feel light and energetic"; category = #health },
    { text = "My body supports me fully"; category = #health },
    { text = "I am free from disease"; category = #health },
    { text = "I am balanced in body and mind"; category = #health },
    { text = "I restore myself daily"; category = #health },
    { text = "I am grounded and centered"; category = #health },
    { text = "My health improves every day"; category = #health },
    { text = "I am full of vitality"; category = #health },
    { text = "My body heals with ease"; category = #health },
    { text = "I honor my body"; category = #health },
    { text = "I am in perfect health"; category = #health },
    { text = "I feel alive and strong"; category = #health },
    { text = "I am energy in motion"; category = #health },
    // Love (25)
    { text = "I am love itself"; category = #love },
    { text = "I give and receive love freely"; category = #love },
    { text = "I am connected to all beings"; category = #love },
    { text = "Love flows through me effortlessly"; category = #love },
    { text = "I radiate compassion"; category = #love },
    { text = "I attract loving relationships"; category = #love },
    { text = "I treat others with kindness"; category = #love },
    { text = "My heart is open"; category = #love },
    { text = "I forgive and release"; category = #love },
    { text = "I am surrounded by love"; category = #love },
    { text = "I respect all beings"; category = #love },
    { text = "I create harmony around me"; category = #love },
    { text = "I am peaceful in relationships"; category = #love },
    { text = "Love expands through me"; category = #love },
    { text = "I nurture meaningful connections"; category = #love },
    { text = "I am worthy of love"; category = #love },
    { text = "I express love freely"; category = #love },
    { text = "I feel unity with everything"; category = #love },
    { text = "I dissolve negativity with love"; category = #love },
    { text = "My heart is pure"; category = #love },
    { text = "I am gentle and strong"; category = #love },
    { text = "I embrace others fully"; category = #love },
    { text = "Love is my true nature"; category = #love },
    { text = "I attract positive energy"; category = #love },
    { text = "I live in harmony"; category = #love },
    // Success (25)
    { text = "I act with purpose"; category = #success },
    { text = "My efforts bring results"; category = #success },
    { text = "I am aligned with my path (dharma)"; category = #success },
    { text = "Success flows to me naturally"; category = #success },
    { text = "I take consistent action"; category = #success },
    { text = "I create opportunities"; category = #success },
    { text = "I am focused and disciplined"; category = #success },
    { text = "I achieve what I commit to"; category = #success },
    { text = "I grow every day"; category = #success },
    { text = "I attract success"; category = #success },
    { text = "I am dedicated to excellence"; category = #success },
    { text = "I overcome obstacles easily"; category = #success },
    { text = "I stay consistent"; category = #success },
    { text = "I act with clarity"; category = #success },
    { text = "I am productive and efficient"; category = #success },
    { text = "My work creates impact"; category = #success },
    { text = "I trust the process"; category = #success },
    { text = "I move towards my goals daily"; category = #success },
    { text = "I achieve meaningful success"; category = #success },
    { text = "I am driven and determined"; category = #success },
    { text = "I use my time wisely"; category = #success },
    { text = "I stay committed"; category = #success },
    { text = "I improve continuously"; category = #success },
    { text = "I create value"; category = #success },
    { text = "I succeed with integrity"; category = #success },
    // Mindfulness (25)
    { text = "I am present in this moment"; category = #mindfulness },
    { text = "My mind is calm and clear"; category = #mindfulness },
    { text = "I observe without judgment"; category = #mindfulness },
    { text = "I am aware of my thoughts"; category = #mindfulness },
    { text = "I am centered within"; category = #mindfulness },
    { text = "I breathe consciously"; category = #mindfulness },
    { text = "I let go of distractions"; category = #mindfulness },
    { text = "I live in the now"; category = #mindfulness },
    { text = "My awareness is sharp"; category = #mindfulness },
    { text = "I am peaceful within"; category = #mindfulness },
    { text = "I respond, not react"; category = #mindfulness },
    { text = "I control my attention"; category = #mindfulness },
    { text = "I am fully conscious"; category = #mindfulness },
    { text = "I observe my emotions calmly"; category = #mindfulness },
    { text = "I remain balanced"; category = #mindfulness },
    { text = "I am grounded in the present"; category = #mindfulness },
    { text = "My thoughts are steady"; category = #mindfulness },
    { text = "I am still and aware"; category = #mindfulness },
    { text = "I focus effortlessly"; category = #mindfulness },
    { text = "I am mindful in action"; category = #mindfulness },
    { text = "I release mental noise"; category = #mindfulness },
    { text = "I stay aware throughout the day"; category = #mindfulness },
    { text = "I cultivate inner silence"; category = #mindfulness },
    { text = "I am conscious of my being"; category = #mindfulness },
    { text = "I live with awareness"; category = #mindfulness },
  ];

  // Seed built-in affirmations on initialization
  do {
    let system_ = Principal.fromText("aaaaa-aa");
    let baseTime = Time.now();
    var i = 0;
    for (entry in seedData.vals()) {
      i += 1;
      let affirmation : Affirmation = {
        id = i;
        text = entry.text;
        category = entry.category;
        isCustom = false;
        authorPrincipal = system_;
        createdAt = baseTime - Int.abs(seedData.size() - i) * 60 * 1_000_000_000;
      };
      affirmations.add(i, affirmation);
    };
    nextId := i + 1;
  };

  // Helper function to check if an affirmation is favorited by a user
  private func isFavoritedBy(affirmationId : Nat, user : Principal) : Bool {
    switch (userFavorites.get(user)) {
      case (null) { false };
      case (?favorites) {
        favorites.any(func(id) { id == affirmationId });
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Affirmation Management
  public query ({ caller }) func getAllByCategory(category : Category) : async [AffirmationWithFavorite] {
    let allAffirmations = affirmations.values().toArray();
    let filtered = allAffirmations.filter(
      func(a) {
        a.category == category;
      }
    );
    filtered.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = isFavoritedBy(a.id, caller);
        };
      }
    );
  };

  public shared ({ caller }) func toggleFavorite(affirmationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can favorite affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?_) {
        let currentFavorites = switch (userFavorites.get(caller)) {
          case (null) { List.empty<Nat>() };
          case (?list) { list };
        };
        let isAlreadyFavorite = currentFavorites.any(
          func(id) { id == affirmationId }
        );
        if (isAlreadyFavorite) {
          let newFavorites = currentFavorites.filter(
            func(id) { id != affirmationId }
          );
          userFavorites.add(caller, newFavorites);
        } else {
          currentFavorites.add(affirmationId);
          userFavorites.add(caller, currentFavorites);
        };
      };
    };
  };

  public shared ({ caller }) func create(text : Text, category : Category) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create affirmations");
    };

    let affirmation : Affirmation = {
      id = nextId;
      text;
      category;
      isCustom = true;
      authorPrincipal = caller;
      createdAt = Time.now();
    };
    affirmations.add(nextId, affirmation);
    nextId += 1;
    affirmation.id;
  };

  public shared ({ caller }) func update(affirmationId : Nat, newText : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?affirmation) {
        if (affirmation.authorPrincipal != caller) {
          Runtime.trap("Unauthorized: Can only update your own affirmations");
        };
        let updatedAffirmation = {
          affirmation with
          text = newText;
        };
        affirmations.add(affirmationId, updatedAffirmation);
      };
    };
  };

  public shared ({ caller }) func delete(affirmationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?affirmation) {
        if (affirmation.authorPrincipal != caller) {
          Runtime.trap("Unauthorized: Can only delete your own affirmations");
        };
        affirmations.remove(affirmationId);
      };
    };
  };

  public query ({ caller }) func getFavorites() : async [AffirmationWithFavorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { return [] };
      case (?favorites) {
        let favoriteIds = favorites.toArray();
        let favoriteAffirmations = favoriteIds.map(
          func(id) {
            switch (affirmations.get(id)) {
              case (null) { null };
              case (?affirmation) {
                ?{
                  affirmation;
                  isFavorite = true;
                };
              };
            };
          }
        );
        favoriteAffirmations.filterMap(func(a) { a }).sort();
      };
    };
  };

  public query ({ caller }) func getCustomAffirmations() : async [AffirmationWithFavorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access custom affirmations");
    };

    let allAffirmations = affirmations.values().toArray();
    let customAffirmations = allAffirmations.filter(
      func(a) {
        a.isCustom and a.authorPrincipal == caller;
      }
    );
    customAffirmations.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = isFavoritedBy(a.id, caller);
        };
      }
    );
  };

  public query ({ caller }) func getDailyAffirmation() : async AffirmationWithFavorite {
    let today = (Time.now() / (24 * 60 * 60 * 1_000_000_000)).toNat();
    let allAffirmations = affirmations.values().toArray();
    if (allAffirmations.size() == 0) {
      Runtime.trap("No affirmations available");
    };
    let index = today % allAffirmations.size();
    {
      affirmation = allAffirmations[index];
      isFavorite = isFavoritedBy(allAffirmations[index].id, caller);
    };
  };

  public query func getAllAffirmations() : async [AffirmationWithFavorite] {
    let allAffirmations = affirmations.values().toArray();
    allAffirmations.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = false;
        };
      }
    );
  };
};
