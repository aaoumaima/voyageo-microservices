Description fonctionnelle de l’application de voyage
Cette application backend gère les fonctionnalités essentielles d’une plateforme de voyage moderne en utilisant une architecture microservices.

Fonctionnalités principales :
Gestion des utilisateurs

Inscription, connexion et gestion des profils des voyageurs.

Authentification sécurisée pour accéder aux services.

Gestion des destinations

Stockage et mise à jour des informations sur différentes destinations touristiques (pays, villes, lieux d’intérêt).

Consultation des détails comme la description, les photos, les prix moyens, etc.

Gestion des réservations

Permet aux utilisateurs de réserver des voyages vers les destinations proposées.

Suivi des réservations en temps réel, avec gestion des statuts (confirmé, annulé, en attente).

Intégration possible avec un service de paiement.

Notifications et événements

Envoi d’événements (ex: confirmation de réservation) via Kafka pour notifier d’autres microservices (ex: facturation, email, SMS).

Communication asynchrone pour garantir la fluidité et la fiabilité du système.



 Technologies utilisées
3.1 REST
Utilisé pour exposer des API simples et stateless, permettant aux clients (frontend, applications mobiles) d’interagir avec les microservices.

Chaque microservice possède son propre endpoint REST.

3.2 GraphQL
Permet une API unifiée et flexible qui interroge plusieurs microservices en une seule requête.

Implémenté via une API Gateway qui fait l’agrégation des données provenant de plusieurs microservices.

3.3 gRPC
Utilisé pour la communication synchrone entre microservices, permettant un échange de données performant et fortement typé via Protocol Buffers.

Exemple : le service Réservations communique avec le service Utilisateurs pour vérifier les informations client.

3.4 Kafka
Employé pour la communication asynchrone entre microservices via un système de messaging.

Permet d’assurer la résilience et la scalabilité, par exemple pour envoyer des événements comme “nouvelle réservation créée” afin d’informer d’autres services (ex: facturation, notification).

4. Architecture générale
diff
Copier
Modifier
[Frontend]
    |
  REST / GraphQL API Gateway
    |
+-----------------------------+
|      Microservices          |
|                             |
|  - Utilisateurs (REST + gRPC)|
|  - Destinations (REST + gRPC)|
|  - Réservations (REST + gRPC)|
+-----------------------------+
    |
   Kafka Broker (échanges asynchrones)
