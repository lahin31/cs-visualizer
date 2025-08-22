"use client"

import { Badge } from "@/components/ui/badge"

export const WalVisualization = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Write Ahead Log (WAL)</h3>
      <div className="border border-border rounded-lg p-4">
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">WAL Structure</div>
          <div className="space-y-1">
            <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
              BEGIN TRANSACTION
            </div>
            <div className="h-6 bg-secondary/30 border border-secondary rounded flex items-center px-2 text-xs">
              INSERT INTO users (id, name) VALUES (101, 'Alice')
            </div>
            <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
              UPDATE B+ tree: Add key 101
            </div>
            <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
              COMMIT TRANSACTION
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          WAL ensures durability: Changes logged before applying to B+ tree
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">WAL Recovery Process</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
            <span className="text-sm">Crash Recovery</span>
            <Badge variant="destructive">Redo Log</Badge>
          </div>
          <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
            <span className="text-sm">Rollback</span>
            <Badge
              style={{
                backgroundColor: "hsl(var(--secondary))",
                color: "hsl(var(--secondary-foreground))",
              }}
            >
              Undo Log
            </Badge>
          </div>
        </div>

        {/* WAL Performance Chart */}
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-3">WAL vs Direct Writes</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs text-muted-foreground">Direct</div>
              <div className="flex-1 bg-muted rounded-full h-3">
                <div className="bg-destructive h-3 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <div className="w-12 text-xs text-muted-foreground">100ms</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs text-muted-foreground">WAL</div>
              <div className="flex-1 bg-muted rounded-full h-3">
                <div className="bg-secondary h-3 rounded-full" style={{ width: "30%" }}></div>
              </div>
              <div className="w-12 text-xs text-muted-foreground">30ms</div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span>Direct Writes (Slower)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded"></div>
              <span>WAL (Faster + Safe)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
