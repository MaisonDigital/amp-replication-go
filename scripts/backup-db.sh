#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/listings_backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

echo "💾 Creating database backup..."

podman-compose -f compose.yml exec postgres pg_dump -U postgres postgres > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup created: $BACKUP_FILE"
    
    # Compress the backup
    gzip $BACKUP_FILE
    echo "✅ Backup compressed: $BACKUP_FILE.gz"
    
    # Keep only last 10 backups
    ls -t $BACKUP_DIR/*.gz | tail -n +11 | xargs -r rm
    echo "✅ Old backups cleaned up"
else
    echo "❌ Backup failed"
    exit 1
fi