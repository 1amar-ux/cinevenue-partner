class CastingCallItem {
  final String id;
  final String roleName;
  final String category; // Lead Actor, Supporting, Child Artist, Extra
  final String ageRange;
  final String gender;
  final int submissionsCount;
  final String status; // OPEN, SHORTLISTING, CLOSED

  const CastingCallItem({
    required this.id,
    required this.roleName,
    required this.category,
    required this.ageRange,
    required this.gender,
    required this.submissionsCount,
    this.status = 'OPEN',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'roleName': roleName,
        'category': category,
        'ageRange': ageRange,
        'gender': gender,
        'submissionsCount': submissionsCount,
        'status': status,
      };

  factory CastingCallItem.fromJson(Map<String, dynamic> json) => CastingCallItem(
        id: json['id'] ?? '',
        roleName: json['roleName'] ?? '',
        category: json['category'] ?? '',
        ageRange: json['ageRange'] ?? '',
        gender: json['gender'] ?? '',
        submissionsCount: json['submissionsCount'] ?? 0,
        status: json['status'] ?? 'OPEN',
      );
}

class ProductionProject {
  final String id;
  final String title;
  final String genre;
  final String director;
  final String stage; // SCRIPTING, PRE_PRODUCTION, FILMING, POST_PRODUCTION, RELEASE_READY
  final double budgetCr;
  final double spentCr;
  final List<CastingCallItem> castingCalls;
  final String expectedRelease;

  const ProductionProject({
    required this.id,
    required this.title,
    required this.genre,
    required this.director,
    required this.stage,
    required this.budgetCr,
    required this.spentCr,
    required this.castingCalls,
    required this.expectedRelease,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'genre': genre,
        'director': director,
        'stage': stage,
        'budgetCr': budgetCr,
        'spentCr': spentCr,
        'castingCalls': castingCalls.map((c) => c.toJson()).toList(),
        'expectedRelease': expectedRelease,
      };

  factory ProductionProject.fromJson(Map<String, dynamic> json) => ProductionProject(
        id: json['id'] ?? '',
        title: json['title'] ?? '',
        genre: json['genre'] ?? '',
        director: json['director'] ?? '',
        stage: json['stage'] ?? 'PRE_PRODUCTION',
        budgetCr: (json['budgetCr'] as num?)?.toDouble() ?? 0.0,
        spentCr: (json['spentCr'] as num?)?.toDouble() ?? 0.0,
        castingCalls: (json['castingCalls'] as List? ?? [])
            .map((c) => CastingCallItem.fromJson(c))
            .toList(),
        expectedRelease: json['expectedRelease'] ?? '',
      );
}

