# CIGMA ERP: Backup & Recovery Guide

To ensure high availability and prevent data loss, CIGMA ERP requires regular database backups.

## Automated Backups via MongoDB Atlas
1. Navigate to the Atlas Dashboard.
2. Select your Cluster -> **Backups**.
3. Enable Cloud Backups. Atlas will automatically snapshot the database incrementally.
4. To restore, select a snapshot and click **Restore**.

## Manual Cold Backups (Cron)
A script has been provided at `backend/src/scripts/backupDatabase.js` to dump the live database to an encrypted `.archive` file.

### Scheduling via Cron (Linux Server)
Run the following to backup every night at 2:00 AM:
```bash
0 2 * * * cd /path/to/cigma/backend && node src/scripts/backupDatabase.js >> backup.log 2>&1
```

### Restoration
To restore a local backup archive:
```bash
mongorestore --uri="mongodb+srv://<user>:<pass>@cluster.net/cigma" --archive=backups/cigma_backup_timestamp.archive --gzip
```

## Static Files
All static assets (Profile Pictures, Certificates, Galleries) are hosted on Cloudinary. We recommend enabling Cloudinary's automatic account backup feature within their settings console to prevent media loss.
